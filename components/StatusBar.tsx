"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { href: "#profile", label: "Profile" },
  { href: "#modules", label: "Modules" },
  { href: "#projects", label: "Projects" },
  { href: "#log", label: "Log" },
  { href: "#contact", label: "Contact" },
];

function formatTime(d: Date) {
  return d.toLocaleTimeString("en-CA", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "America/Vancouver",
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
      <a href="#top" className="statusbar__id">
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
      <span className="statusbar__clock" aria-label="Local time in Victoria">
        YYJ {time ?? "--:--:--"}
      </span>
    </header>
  );
}
