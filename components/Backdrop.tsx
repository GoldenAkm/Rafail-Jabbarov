// Fixed full-screen background: grid, PCB traces with travelling pulses,
// HUD telemetry in the margins, and (Day theme) engineering-drawing annotations.
// Pure SVG + CSS, rendered on the server; layouts are seeded so they never shift.

const W = 1600;
const H = 1000;
const STEP = 40; // trace routing grid, in viewBox units

// Small deterministic PRNG so server and client always draw the same board
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Trace = { d: string; start: [number, number]; end: [number, number] };

// Routes traces PCB-style: straight runs with 45° bends, kept mostly to the
// left and right thirds so they frame the content instead of crossing it.
function buildTraces(count: number, seed: number): Trace[] {
  const rand = mulberry32(seed);
  const traces: Trace[] = [];

  for (let i = 0; i < count; i++) {
    const leftSide = i % 2 === 0;
    let x = Math.round(((leftSide ? 0 : W * 0.68) + rand() * W * 0.32) / STEP) * STEP;
    let y = Math.round((rand() * H) / STEP) * STEP;
    const start: [number, number] = [x, y];
    let d = `M${x} ${y}`;

    // Head toward the nearest outer edge, with occasional diagonal jogs
    const dirX = leftSide ? -1 : 1;
    const segments = 3 + Math.floor(rand() * 4);
    for (let s = 0; s < segments; s++) {
      const len = STEP * (1 + Math.floor(rand() * 4));
      const r = rand();
      if (r < 0.45) x += dirX * len;
      else if (r < 0.75) y += (rand() < 0.5 ? -1 : 1) * len;
      else {
        x += dirX * len;
        y += (rand() < 0.5 ? -1 : 1) * len;
      }
      x = Math.max(0, Math.min(W, x));
      y = Math.max(0, Math.min(H, y));
      d += ` L${x} ${y}`;
    }
    traces.push({ d, start, end: [x, y] });
  }
  return traces;
}

const TRACES = buildTraces(34, 2028);
// Every third trace carries a light pulse, each with its own timing
const PULSES = TRACES.filter((_, i) => i % 3 === 0).map((t, i) => ({
  d: t.d,
  dur: 7 + (i % 5) * 1.6,
  delay: -(i * 1.3),
}));

const HEX = Array.from({ length: 24 }, (_, i) => {
  const rand = mulberry32(i + 7);
  return `0x${Math.floor(rand() * 0xffff)
    .toString(16)
    .toUpperCase()
    .padStart(4, "0")}`;
});

const BARS = [3, 6, 4, 8, 5, 7, 2, 6, 9, 4, 6, 3];

export default function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <svg className="backdrop__board" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
        <g className="board__traces">
          {TRACES.map((t, i) => (
            <path key={i} d={t.d} />
          ))}
        </g>
        <g className="board__vias">
          {TRACES.flatMap((t, i) => [
            <circle key={`s${i}`} cx={t.start[0]} cy={t.start[1]} r={4.5} />,
            <circle key={`e${i}`} cx={t.end[0]} cy={t.end[1]} r={3} />,
          ])}
        </g>
        <g className="board__pulses">
          {PULSES.map((p, i) => (
            <path
              key={i}
              d={p.d}
              pathLength={1000}
              style={{ animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s` }}
            />
          ))}
        </g>

        {/* Day theme: engineering-drawing details */}
        <g className="board__drawing">
          <g className="dim">
            <line x1={80} y1={940} x2={480} y2={940} />
            <line x1={80} y1={925} x2={80} y2={955} />
            <line x1={480} y1={925} x2={480} y2={955} />
            <text x={280} y={930} textAnchor="middle">100.00 mm</text>
          </g>
          <g className="dim">
            <line x1={1540} y1={120} x2={1540} y2={360} />
            <line x1={1525} y1={120} x2={1555} y2={120} />
            <line x1={1525} y1={360} x2={1555} y2={360} />
            <text x={1528} y={244} textAnchor="end">60.00</text>
          </g>
          <circle className="datum" cx={160} cy={160} r={26} />
          <text className="callout" x={196} y={150}>A</text>
          <line className="leader" x1={186} y1={160} x2={260} y2={210} />
          <text className="callout" x={268} y={218}>Ø3.2 THRU ×4</text>
        </g>
      </svg>

      {/* HUD telemetry in the margins */}
      <div className="hud hud--coords">
        <span>+ LAT 48.4634°N</span>
        <span>LON 123.3117°W</span>
        <span className="muted">GRID 040 // UVIC</span>
      </div>

      <div className="hud hud--hex">
        <div className="hud__hex-scroll">
          {[...HEX, ...HEX].map((h, i) => (
            <span key={i}>{h}</span>
          ))}
        </div>
      </div>

      <div className="hud hud--bars">
        <span className="muted">SYS LOAD</span>
        <div className="hud__bars">
          {BARS.map((b, i) => (
            <span key={i} style={{ height: `${b * 3}px`, animationDelay: `${-i * 0.37}s` }} />
          ))}
        </div>
      </div>

      <div className="hud hud--serial">
        <span>S/N RJ-2028-CE</span>
        <span className="muted">REV A // BUILD 0.1</span>
      </div>

      {/* Day theme: drawing title block */}
      <div className="title-block">
        <div>
          <span className="muted">DWG NO.</span> RJ-PORT-001
        </div>
        <div>
          <span className="muted">SCALE</span> 1:1 <span className="muted">REV</span> A
        </div>
        <div>
          <span className="muted">DRAWN</span> R. JABBAROV
        </div>
      </div>

      <span className="crosshair crosshair--tl" />
      <span className="crosshair crosshair--tr" />
      <span className="crosshair crosshair--bl" />
      <span className="crosshair crosshair--br" />
    </div>
  );
}
