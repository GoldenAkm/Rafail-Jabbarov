"use client";

import { useEffect, useRef, useState } from "react";
import { tracks } from "@/data/music";
import type { Theme } from "@/lib/theme";

const VOLUME = 0.35;
const FADE_MS = 600;

function currentTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

// Smoothly ramps volume so starts, stops and track swaps never click
function fade(audio: HTMLAudioElement, to: number, ms = FADE_MS) {
  return new Promise<void>((resolve) => {
    const from = audio.volume;
    const start = performance.now();
    const step = () => {
      const k = Math.min(1, (performance.now() - start) / ms);
      audio.volume = from + (to - from) * k;
      if (k < 1) requestAnimationFrame(step);
      else resolve();
    };
    step();
  });
}

// Off by default (browsers block autoplay anyway). Plays the Night or Day track
// to match the theme, and crossfades when the theme toggle flips.
// Tracks are fetched as raw bytes and played from blob: URLs, so the browser
// never makes a media request for download managers to hijack.
export default function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const blobUrls = useRef<Partial<Record<Theme, string>>>({});
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");

  const loadTrack = async (t: Theme) => {
    const cached = blobUrls.current[t];
    if (cached) return cached;
    const res = await fetch(`/api/music/${t}`);
    if (!res.ok) throw new Error(`Track request failed (${res.status})`);
    const blob = new Blob([await res.arrayBuffer()], { type: "audio/mpeg" });
    const url = URL.createObjectURL(blob);
    blobUrls.current[t] = url;
    return url;
  };

  // Follow theme changes made by ThemeToggle (it sets data-theme on <html>)
  useEffect(() => {
    setTheme(currentTheme());
    const observer = new MutationObserver(() => setTheme(currentTheme()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const urls = blobUrls.current;
    return () => {
      observer.disconnect();
      Object.values(urls).forEach((u) => u && URL.revokeObjectURL(u));
    };
  }, []);

  // Swap tracks on theme change while playing; the old one keeps going until the new one is loaded
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !playing || audio.dataset.track === theme) return;

    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const url = await loadTrack(theme);
        if (cancelled) return;
        await fade(audio, 0, FADE_MS / 2);
        if (cancelled) return;
        audio.src = url;
        audio.dataset.track = theme;
        await audio.play();
        await fade(audio, VOLUME);
      } catch {
        if (!cancelled) setPlaying(false);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [theme, playing]);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio || loading) return;
    if (playing) {
      setPlaying(false);
      await fade(audio, 0, FADE_MS / 2);
      audio.pause();
      return;
    }

    try {
      setLoading(true);
      if (audio.dataset.track !== theme) {
        audio.src = await loadTrack(theme);
        audio.dataset.track = theme;
      }
      audio.volume = 0;
      await audio.play();
      setPlaying(true);
      await fade(audio, VOLUME);
    } catch {
      setPlaying(false);
    } finally {
      setLoading(false);
    }
  };

  const action = loading ? "Loading music" : playing ? "Pause music" : "Play music";
  const label = `${action}: ${tracks[theme].title}`;

  return (
    <>
      <button
        type="button"
        className={`music-toggle${playing ? " is-playing" : ""}${loading ? " is-loading" : ""}`}
        onClick={toggle}
        aria-label={label}
        aria-pressed={playing}
        aria-busy={loading}
        title={label}
      >
        <span className="music-toggle__eq" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </span>
        <span className="music-toggle__text">{loading ? "Loading" : playing ? "Audio on" : "Audio off"}</span>
      </button>
      <audio ref={audioRef} loop preload="none" />
    </>
  );
}
