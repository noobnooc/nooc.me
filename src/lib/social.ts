import fallback from "./social-fallback.json";

/**
 * Live social profile stats shown in the hover cards. Served by
 * /api/social at runtime; `socialFallback` is a committed snapshot used
 * whenever the live data hasn't loaded (prerendered HTML, network
 * failures, upstream outages).
 */

export interface GitHubStats {
  handle: string;
  name: string;
  followers: number;
  following: number;
  publicRepos: number;
  /** Contributions over the last year. */
  totalContributions: number;
  /** One digit (0-4) per day, oldest first, ending at `endDate`. */
  levels: string;
  /** Date of the last digit in `levels` (YYYY-MM-DD). */
  endDate: string;
}

export interface XStats {
  handle: string;
  name: string;
  bio: string;
  location: string;
  followers: number;
  following: number;
  posts: number;
  /** Year the account joined. */
  joined: string;
}

export interface TelegramStats {
  handle: string;
  name: string;
  bio: string;
}

export interface SocialStats {
  fetchedAt: string;
  github: GitHubStats;
  x: XStats;
  telegram: TelegramStats;
}

export const socialFallback: SocialStats = fallback;
