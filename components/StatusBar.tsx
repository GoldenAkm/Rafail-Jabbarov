"use client";

import { useEffect, useState } from "react";
import MusicToggle from "./MusicToggle";
import ThemeToggle from "./ThemeToggle";

const LINKS = [
  // Leading "/" so the links also work from /resume
  { href: "/#profile", label: "Profile" },
  { href: "/#modules", label: "Modules" },
  { href: "/#projects", label: "Projects" },
  { href: "/#log", label: "Log" },
  { href: "/resume", label: "Resume" },
];

// Visitor's local time (their device's time zone, no permission prompt needed)
function formatTime(d: Date) {
  return d.toLocaleTimeString("en-CA", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export default function StatusBar() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    setTime(formatTime(new Date()));
    const id = window.setInterval(() => setTime(formatTime(new Date())), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <header className="statusbar">
      <a href="/#top" className="statusbar__id">
        <span className="dot" aria-hidden="true" /> RJ<span className="muted">//</span>SYS
      </a>
      <nav aria-label="Sections">
        <ul>
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="statusbar__right">
        <span className="statusbar__clock" aria-label="Your local time">
          <span className="statusbar__clock-label">LOCAL TIME </span>
          {time ?? "--:--:--"}
        </span>
        <MusicToggle />
        <ThemeToggle />
      </div>
    </header>
  );
}
