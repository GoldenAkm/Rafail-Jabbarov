"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/<>_";

type Props = {
  text: string;
  as?: "span" | "h1" | "h2" | "h3";
  className?: string;
  // ms per resolved character
  speed?: number;
};

// Scrambles text and resolves it left to right the first time it scrolls into view.
export default function DecodeText({ text, as: Tag = "span", className, speed = 28 }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let timer: number | undefined;

    const run = () => {
      const start = performance.now();
      const tick = () => {
        const resolved = Math.floor((performance.now() - start) / speed);
        if (resolved >= text.length) {
          setDisplay(text);
          return;
        }
        let out = text.slice(0, resolved);
        for (let i = resolved; i < text.length; i++) {
          out += text[i] === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        setDisplay(out);
        frame = requestAnimationFrame(tick);
      };
      tick();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          timer = window.setTimeout(run, 80);
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [text, speed]);

  return (
    <Tag ref={ref as never} className={className} aria-label={text}>
      <span aria-hidden="true">{display}</span>
    </Tag>
  );
}
