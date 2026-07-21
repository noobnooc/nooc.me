import { browser } from "$app/environment";
import { socialFallback, type SocialStats } from "./social";

/**
 * Shared client-side state for the social hover cards. Starts from the
 * committed snapshot so cards always have data, then upgrades to live
 * numbers from /api/social. The fetch runs at most once per page load and
 * is kicked off before a card opens, so an open card never waits on the
 * network.
 */
export const social = $state<{ stats: SocialStats }>({ stats: socialFallback });

let started = false;

export function ensureSocialStats(): void {
  if (!browser || started) return;
  started = true;

  // The query string versions the payload shape past stale edge-cache
  // entries from earlier deploys.
  fetch("/api/social?v=2", { headers: { accept: "application/json" } })
    .then((res) => (res.ok ? res.json() : null))
    .then((data: SocialStats | null) => {
      if (data?.github?.levels && data.x && data.telegram) {
        social.stats = data;
      }
    })
    .catch(() => {
      // Keep the snapshot values.
    });
}
