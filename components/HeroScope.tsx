// Oscilloscope display behind the hero: graticule plus two drifting signal traces.
// Each wave is drawn twice as wide as the screen and slid left by half its width,
// so it loops seamlessly. Frequencies are whole cycles per tile for that reason.

const TILE = 600;
const MID = 160;

function wavePath(fn: (t: number) => number) {
  let d = "";
  for (let x = 0; x <= TILE * 2; x += 4) {
    const t = (x / TILE) * Math.PI * 2;
    d += `${x === 0 ? "M" : " L"}${x} ${(MID + fn(t)).toFixed(1)}`;
  }
  return d;
}

// CH1: a clock-ish signal with ringing; CH2: a smooth composite sine
const CH1 = wavePath((t) => 52 * Math.tanh(4 * Math.sin(2 * t)) + 6 * Math.sin(22 * t));
const CH2 = wavePath((t) => 38 * Math.sin(3 * t) + 14 * Math.sin(7 * t + 1));

export default function HeroScope() {
  return (
    <div className="scope" aria-hidden="true">
      <svg className="scope__screen" viewBox={`0 0 ${TILE} 320`} preserveAspectRatio="none">
        <g className="scope__grid">
          {Array.from({ length: 11 }, (_, i) => (
            <line key={`v${i}`} x1={i * 60} y1={0} x2={i * 60} y2={320} />
          ))}
          {Array.from({ length: 9 }, (_, i) => (
            <line key={`h${i}`} x1={0} y1={i * 40} x2={TILE} y2={i * 40} />
          ))}
          <line className="scope__axis" x1={0} y1={MID} x2={TILE} y2={MID} />
          <line className="scope__axis" x1={TILE / 2} y1={0} x2={TILE / 2} y2={320} />
        </g>
        <g className="scope__wave scope__wave--ch1">
          <path d={CH1} />
        </g>
        <g className="scope__wave scope__wave--ch2">
          <path d={CH2} />
        </g>
      </svg>
      <div className="scope__labels">
        <span>CH1 2.00V/div</span>
        <span>CH2 500mV/div</span>
        <span>1.00ms/div</span>
        <span className="scope__trig">TRIG ▲ 1.20V</span>
      </div>
    </div>
  );
}
