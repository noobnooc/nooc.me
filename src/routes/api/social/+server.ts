import { json } from "@sveltejs/kit";
import {
  socialFallback,
  type GitHubStats,
  type SocialStats,
  type XStats,
} from "$lib/social";
import type { RequestHandler } from "./$types";

// Live profile stats for the social hover cards. Served by the worker so
// numbers stay fresh without rebuilding the prerendered site. Layered
// caching keeps upstream traffic near zero: Cloudflare edge cache (per
// colo) -> KV last-good snapshot (global) -> bundled fallback snapshot.
export const prerender = false;

const GITHUB_HANDLE = "noobnooc";
const X_HANDLE = "noobnooc";
const KV_KEY = "social-stats:v1";
/** Days of contribution history to expose (18 weeks). */
const HEATMAP_DAYS = 126;

const USER_AGENT = "nooc.me-social-card (+https://nooc.me)";

type GitHubProfile = Pick<
  GitHubStats,
  "handle" | "name" | "followers" | "following" | "publicRepos"
>;
type GitHubContributions = Pick<
  GitHubStats,
  "totalContributions" | "levels" | "endDate"
>;

function assertNumber(value: unknown, label: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`unexpected ${label}: ${value}`);
  }
  return value;
}

async function fetchGitHubProfile(): Promise<GitHubProfile> {
  const res = await fetch(`https://api.github.com/users/${GITHUB_HANDLE}`, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "application/vnd.github+json",
    },
  });
  if (!res.ok) throw new Error(`github profile ${res.status}`);
  const data = (await res.json()) as Record<string, unknown>;
  return {
    handle: GITHUB_HANDLE,
    name: typeof data.name === "string" ? data.name : GITHUB_HANDLE,
    followers: assertNumber(data.followers, "github followers"),
    following: assertNumber(data.following, "github following"),
    publicRepos: assertNumber(data.public_repos, "github public_repos"),
  };
}

function toContributions(
  days: { date: string; level: number }[],
  total: number,
): GitHubContributions {
  const recent = days
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-HEATMAP_DAYS);
  if (recent.length === 0) throw new Error("no contribution days");
  return {
    totalContributions: total,
    levels: recent.map((day) => String(Math.min(4, Math.max(0, day.level)))).join(""),
    endDate: recent[recent.length - 1].date,
  };
}

/** Parse GitHub's own contribution-calendar HTML fragment. */
async function fetchContributionsFromGitHub(): Promise<GitHubContributions> {
  const res = await fetch(
    `https://github.com/users/${GITHUB_HANDLE}/contributions`,
    { headers: { "User-Agent": USER_AGENT, Accept: "text/html" } },
  );
  if (!res.ok) throw new Error(`github contributions ${res.status}`);
  const html = await res.text();

  const days: { date: string; level: number }[] = [];
  const cell =
    /data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d)"|data-level="(\d)"[^>]*data-date="(\d{4}-\d{2}-\d{2})"/g;
  for (const match of html.matchAll(cell)) {
    const date = match[1] ?? match[4];
    const level = Number(match[2] ?? match[3]);
    if (date) days.push({ date, level });
  }

  const totalMatch = /([\d,]+)\s+contributions?/.exec(html);
  const total = totalMatch
    ? Number(totalMatch[1].replaceAll(",", ""))
    : socialFallback.github.totalContributions;

  return toContributions(days, total);
}

/** Public mirror of the contribution calendar, used when GitHub's HTML
 * endpoint is unreachable or its markup changes. */
async function fetchContributionsFromMirror(): Promise<GitHubContributions> {
  const res = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${GITHUB_HANDLE}?y=last`,
    { headers: { "User-Agent": USER_AGENT, Accept: "application/json" } },
  );
  if (!res.ok) throw new Error(`contributions mirror ${res.status}`);
  const data = (await res.json()) as {
    total?: { lastYear?: number };
    contributions?: { date: string; level: number }[];
  };
  if (!Array.isArray(data.contributions)) {
    throw new Error("contributions mirror shape");
  }
  return toContributions(
    data.contributions,
    assertNumber(data.total?.lastYear, "contributions total"),
  );
}

async function fetchGitHubContributions(): Promise<GitHubContributions> {
  try {
    return await fetchContributionsFromGitHub();
  } catch {
    return await fetchContributionsFromMirror();
  }
}

async function fetchXProfile(): Promise<XStats> {
  const res = await fetch(`https://api.fxtwitter.com/${X_HANDLE}`, {
    headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`x profile ${res.status}`);
  const data = (await res.json()) as {
    user?: Record<string, unknown>;
  };
  const user = data.user;
  if (!user) throw new Error("x profile shape");
  const joined =
    typeof user.joined === "string" && !Number.isNaN(Date.parse(user.joined))
      ? String(new Date(user.joined).getUTCFullYear())
      : socialFallback.x.joined;
  return {
    handle: typeof user.screen_name === "string" ? user.screen_name : X_HANDLE,
    name: typeof user.name === "string" ? user.name : socialFallback.x.name,
    bio: typeof user.description === "string" ? user.description : "",
    location: typeof user.location === "string" ? user.location : "",
    followers: assertNumber(user.followers, "x followers"),
    following: assertNumber(user.following, "x following"),
    posts: assertNumber(user.tweets, "x tweets"),
    joined,
  };
}

export const GET: RequestHandler = async ({ request, platform }) => {
  const cache = platform?.caches?.default;
  const cached = await cache?.match(request.url);
  if (cached) return cached;

  const kv = platform?.env?.SOCIAL_CACHE;
  const lastGood = (await kv
    ?.get(KV_KEY, "json")
    .catch(() => null)) as SocialStats | null;
  const base = lastGood ?? socialFallback;

  const [profile, contributions, x] = await Promise.allSettled([
    fetchGitHubProfile(),
    fetchGitHubContributions(),
    fetchXProfile(),
  ]);
  const anyFresh = [profile, contributions, x].some(
    (result) => result.status === "fulfilled",
  );

  const stats: SocialStats = {
    fetchedAt: anyFresh ? new Date().toISOString() : base.fetchedAt,
    github: {
      ...base.github,
      ...(profile.status === "fulfilled" ? profile.value : {}),
      ...(contributions.status === "fulfilled" ? contributions.value : {}),
    },
    x: x.status === "fulfilled" ? x.value : base.x,
  };

  if (anyFresh && kv) {
    platform?.context?.waitUntil(kv.put(KV_KEY, JSON.stringify(stats)));
  }

  // Short client cache; the edge holds it longer. Upstream failures get a
  // brief TTL so the next request retries soon.
  const response = json(stats, {
    headers: {
      "Cache-Control": anyFresh
        ? "public, max-age=3600, s-maxage=14400"
        : "public, max-age=300",
      "Access-Control-Allow-Origin": "*",
    },
  });

  if (anyFresh && cache) {
    platform?.context?.waitUntil(cache.put(request.url, response.clone()));
  }

  return response;
};
