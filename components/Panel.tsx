import type { ReactNode } from "react";

type Props = {
  label?: string;
  code?: string;
  className?: string;
  children: ReactNode;
};

// HUD frame: chamfered border, corner brackets and an optional header strip.
export default function Panel({ label, code, className = "", children }: Props) {
  return (
    <div className={`panel ${className}`}>
      <span className="panel__corner panel__corner--tl" aria-hidden="true" />
      <span className="panel__corner panel__corner--br" aria-hidden="true" />
      {(label || code) && (
        <div className="panel__head">
          {label && <span>{label}</span>}
          {code && <span className="muted">{code}</span>}
        </div>
      )}
      <div className="panel__body">{children}</div>
    </div>
  );
}
