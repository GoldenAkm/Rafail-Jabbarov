import type { Theme } from "@/lib/theme";

// Files live in /audio (not /public) and are served by app/api/music/[theme].
// Both tracks are CC0 (no attribution required); credited anyway as the artist asks.
export const tracks: Record<Theme, { title: string; file: string }> = {
  dark: { title: "Calm Ambient 1 (Synthwave 4k)", file: "night-calm-ambient-1.mp3" },
  light: { title: "Calm Ambient 2 (Synthwave 15k)", file: "day-calm-ambient-2.mp3" },
};

export const musicCredit = {
  artist: "The Cynic Project",
  url: "https://cynicmusic.com",
  license: "CC0",
};
