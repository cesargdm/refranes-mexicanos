export const FLAG_COLORS = [
  "#eb00af",
  "#1fa6a6",
  "#f5b722",
  "#7a3bd7",
  "#e8453c",
];

const PAPER = "#fff7f0";

function silhouettePath(w: number, h: number): string {
  const notch = h * 0.13;
  const teeth = 6;
  const tw = w / teeth;
  let d = `M0 0 L${w} 0 L${w} ${h - notch}`;
  for (let i = 0; i < teeth; i++) {
    const point = w - (i + 0.5) * tw;
    const valley = w - (i + 1) * tw;
    d += ` L${point} ${h} L${valley} ${h - notch}`;
  }
  return d + " Z";
}

type FlagProps = {
  color: string;
  width?: number;
  height?: number;
  className?: string;
};

/** An SVG papel picado flag with a zigzag fringe and punched decoration. */
export function PapelFlag({
  color,
  width = 200,
  height = 168,
  className,
}: FlagProps) {
  const w = 200;
  const h = 168;
  const unit = Math.min(w, h);
  const r = unit * 0.032;
  const d = unit * 0.05;

  const dots = 5;
  const topDots = Array.from({ length: dots }, (_, i) => ({
    x: (w / (dots + 1)) * (i + 1),
    y: h * 0.13,
  }));
  const topDiamonds = Array.from({ length: dots - 1 }, (_, i) => {
    const x = (w / (dots + 1)) * (i + 1.5);
    const y = h * 0.13;
    return `${x},${y - d} ${x + d},${y} ${x},${y + d} ${x - d},${y}`;
  });
  const teeth = 6;
  const tw = w / teeth;
  const bottomDots = Array.from({ length: teeth }, (_, i) => ({
    x: (i + 0.5) * tw,
    y: h * 0.87 - r * 1.4,
  }));

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={width}
      height={height}
      className={className}
      role="presentation"
    >
      <path d={silhouettePath(w, h)} fill={color} />
      {topDots.map((p, i) => (
        <circle key={`td${i}`} cx={p.x} cy={p.y} r={r} fill={PAPER} />
      ))}
      {topDiamonds.map((pts, i) => (
        <polygon key={`dia${i}`} points={pts} fill={PAPER} />
      ))}
      {bottomDots.map((p, i) => (
        <circle key={`bd${i}`} cx={p.x} cy={p.y} r={r * 0.7} fill={PAPER} />
      ))}
    </svg>
  );
}

type GarlandProps = {
  count?: number;
};

/** A swaying string of mini papel picado flags. */
export function Garland({ count = 12 }: GarlandProps) {
  return (
    <div className="relative w-full overflow-hidden" aria-hidden>
      <div className="absolute inset-x-0 top-3 border-t-2 border-ink/25" />
      <ul className="flex justify-center gap-1 px-2">
        {Array.from({ length: count }, (_, i) => (
          <li
            key={i}
            className="papel-flag"
            style={{ animationDelay: `${(i % 5) * 0.2}s` }}
          >
            <PapelFlag
              color={FLAG_COLORS[i % FLAG_COLORS.length]}
              width={42}
              height={36}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
