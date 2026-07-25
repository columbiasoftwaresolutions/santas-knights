type Point = {
  date: string;
  value: number;
};

const WIDTH = 760;
const HEIGHT = 248;
const PAD = { top: 20, right: 18, bottom: 42, left: 38 };

export function GiftChart({
  title,
  points,
  color,
}: {
  title: string;
  points: Point[];
  color: "red" | "amber";
}) {
  const maximum = Math.max(1, ...points.map((point) => point.value));
  const chartWidth = WIDTH - PAD.left - PAD.right;
  const chartHeight = HEIGHT - PAD.top - PAD.bottom;
  const x = (index: number) =>
    PAD.left + (points.length === 1 ? chartWidth / 2 : (index / (points.length - 1)) * chartWidth);
  const y = (value: number) => PAD.top + chartHeight - (value / maximum) * chartHeight;
  const line = points.map((point, index) => `${x(index)},${y(point.value)}`).join(" ");
  const area = points.length
    ? `${PAD.left},${PAD.top + chartHeight} ${line} ${x(points.length - 1)},${PAD.top + chartHeight}`
    : "";
  const stroke = color === "red" ? "#c2331f" : "#c98a3a";
  const labelIndexes = new Set([0, Math.floor((points.length - 1) / 2), points.length - 1]);
  const gridValues = [0, Math.ceil(maximum / 2), maximum];

  return (
    <figure className="min-w-0 max-w-full border border-line bg-card">
      <figcaption className="flex items-baseline justify-between gap-4 border-b border-line px-5 py-4">
        <h3 className="text-[15px] font-extrabold">{title}</h3>
        <span className="text-[12px] text-muted">Daily · New York time</span>
      </figcaption>
      <div className="max-w-full overflow-x-auto px-2 py-3">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="min-w-[560px] w-full"
          role="img"
          aria-label={`${title} by day`}
        >
          {gridValues.map((value) => {
            const gridY = y(value);
            return (
              <g key={value}>
                <line x1={PAD.left} x2={WIDTH - PAD.right} y1={gridY} y2={gridY} stroke="#e4d8c4" />
                <text x={PAD.left - 10} y={gridY + 4} textAnchor="end" fill="#6c6256" fontSize="11">
                  {value}
                </text>
              </g>
            );
          })}
          {area && <polygon points={area} fill={stroke} opacity="0.1" />}
          {line && (
            <polyline
              points={line}
              fill="none"
              stroke={stroke}
              strokeWidth="3"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}
          {points.map((point, index) => (
            <g key={point.date}>
              <circle cx={x(index)} cy={y(point.value)} r="4" fill="#ffffff" stroke={stroke} strokeWidth="2.5">
                <title>{`${point.date}: ${point.value}`}</title>
              </circle>
              {labelIndexes.has(index) && (
                <text
                  x={x(index)}
                  y={HEIGHT - 14}
                  textAnchor={index === 0 ? "start" : index === points.length - 1 ? "end" : "middle"}
                  fill="#6c6256"
                  fontSize="11"
                >
                  {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" }).format(
                    new Date(`${point.date}T12:00:00Z`),
                  )}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>
    </figure>
  );
}
