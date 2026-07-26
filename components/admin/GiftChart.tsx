"use client";

import { useEffect, useRef, useState } from "react";
import type { Grain } from "@/lib/dates";

type Point = {
  date: string;
  value: number;
};

const PAD = { top: 20, right: 18, bottom: 42, left: 38 };
const DEFAULT_SIZE = { width: 760, height: 300 };
const TOOLTIP_EDGE = 118;

const STROKE: Record<"red" | "amber" | "green", string> = {
  red: "#c2331f",
  amber: "#c98a3a",
  green: "#2e5e45",
};

const GRAIN_WORD: Record<Grain, string> = { day: "daily", week: "weekly", month: "monthly" };
const GRAIN_UNIT: Record<Grain, string> = { day: "day", week: "week", month: "month" };

export function GiftChart({
  title,
  points,
  color,
  grain = "day",
}: {
  title: string;
  points: Point[];
  color: "red" | "amber" | "green";
  grain?: Grain;
}) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(DEFAULT_SIZE);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { width, height } = size;
  const maximum = Math.max(1, ...points.map((point) => point.value));
  const chartWidth = width - PAD.left - PAD.right;
  const chartHeight = height - PAD.top - PAD.bottom;
  const x = (index: number) =>
    PAD.left + (points.length === 1 ? chartWidth / 2 : (index / (points.length - 1)) * chartWidth);
  const y = (value: number) => PAD.top + chartHeight - (value / maximum) * chartHeight;
  const line = points.map((point, index) => `${x(index)},${y(point.value)}`).join(" ");
  const area = points.length
    ? `${PAD.left},${PAD.top + chartHeight} ${line} ${x(points.length - 1)},${PAD.top + chartHeight}`
    : "";
  const stroke = STROKE[color];
  const labelIndexes = new Set([0, Math.floor((points.length - 1) / 2), points.length - 1]);
  const gridValues = Array.from(new Set([0, Math.ceil(maximum / 2), maximum]));
  const activePoint = activeIndex === null ? null : points[activeIndex];
  const activeX = activeIndex === null ? 0 : x(activeIndex);
  const activeY = activePoint ? y(activePoint.value) : 0;

  useEffect(() => {
    const element = chartRef.current;
    if (!element) return;
    const updateSize = () => {
      const bounds = element.getBoundingClientRect();
      setSize({
        width: Math.max(280, Math.round(bounds.width)),
        height: Math.round(bounds.height),
      });
    };
    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  function nearestPoint(clientX: number, clientY: number): number | null {
    const bounds = chartRef.current?.getBoundingClientRect();
    if (!bounds || points.length === 0) return null;
    const pointerX = clientX - bounds.left;
    const pointerY = clientY - bounds.top;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    points.forEach((point, index) => {
      const distance = Math.hypot(pointerX - x(index), pointerY - y(point.value));
      if (distance < closestDistance) {
        closestIndex = index;
        closestDistance = distance;
      }
    });
    return closestDistance <= 38 ? closestIndex : null;
  }

  const horizontalPosition =
    activeX < TOOLTIP_EDGE ? "translate-x-2" : activeX > width - TOOLTIP_EDGE ? "-translate-x-[calc(100%+8px)]" : "-translate-x-1/2";
  const verticalPosition = activeY < 82 ? "translate-y-3" : "-translate-y-[calc(100%+12px)]";

  return (
    <figure className="min-w-0 max-w-full border border-line bg-card">
      <figcaption className="flex items-baseline justify-between gap-3 border-b border-line px-5 py-4">
        <h3 className="text-[15px] font-extrabold">{title}</h3>
        <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-muted">
          {GRAIN_WORD[grain]}
        </span>
      </figcaption>
      <div
        ref={chartRef}
        className="relative h-[260px] w-full overflow-hidden sm:h-[300px]"
        onPointerMove={(event) => {
          if (event.pointerType !== "touch") setActiveIndex(nearestPoint(event.clientX, event.clientY));
        }}
        onPointerLeave={(event) => {
          if (event.pointerType !== "touch") setActiveIndex(null);
        }}
        onPointerDown={(event) => {
          if (event.pointerType === "touch") setActiveIndex(nearestPoint(event.clientX, event.clientY));
        }}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label={`${title} by ${GRAIN_UNIT[grain]}`}
        >
          {gridValues.map((value) => {
            const gridY = y(value);
            return (
              <g key={value}>
                <line x1={PAD.left} x2={width - PAD.right} y1={gridY} y2={gridY} stroke="#e4d8c4" />
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
          {activePoint && (
            <line
              x1={activeX}
              x2={activeX}
              y1={PAD.top}
              y2={height - PAD.bottom}
              stroke={stroke}
              strokeDasharray="3 5"
              opacity="0.28"
            />
          )}
          {points.map((point, index) => (
            <g key={point.date}>
              <circle
                cx={x(index)}
                cy={y(point.value)}
                r={activeIndex === index ? 6 : 4}
                fill="#ffffff"
                stroke={stroke}
                strokeWidth="2.5"
                tabIndex={0}
                className="cursor-crosshair outline-none"
                aria-label={`${formatDate(point.date, grain)}: ${formatValue(title, point.value)}`}
                onFocus={() => setActiveIndex(index)}
                onBlur={() => setActiveIndex(null)}
              />
              {labelIndexes.has(index) && (
                <text
                  x={x(index)}
                  y={height - 14}
                  textAnchor={index === 0 ? "start" : index === points.length - 1 ? "end" : "middle"}
                  fill="#6c6256"
                  fontSize="11"
                >
                  {formatShortDate(point.date, grain)}
                </text>
              )}
            </g>
          ))}
        </svg>
        {activePoint && (
          <div
            role="status"
            className={`pointer-events-none absolute z-10 min-w-[142px] border-t-2 bg-ink px-3 py-2 text-bone shadow-[0_2px_8px_rgba(22,18,15,0.18)] ${horizontalPosition} ${verticalPosition}`}
            style={{ left: activeX, top: activeY, borderTopColor: stroke }}
          >
            <p className="text-[11px] font-semibold text-bone/65">{formatDate(activePoint.date, grain)}</p>
            <p className="mt-0.5 text-[13px] font-extrabold">{formatValue(title, activePoint.value)}</p>
          </div>
        )}
      </div>
    </figure>
  );
}

/** Compact axis label: "Jan" for months, "Jan 5" for days/weeks. */
function formatShortDate(date: string, grain: Grain): string {
  const d = new Date(`${date}T12:00:00Z`);
  const opts: Intl.DateTimeFormatOptions =
    grain === "month"
      ? { month: "short", year: "numeric", timeZone: "UTC" }
      : { month: "short", day: "numeric", timeZone: "UTC" };
  return new Intl.DateTimeFormat("en-US", opts).format(d);
}

/** Full tooltip label: month name, "Week of …", or a plain date. */
function formatDate(date: string, grain: Grain): string {
  const d = new Date(`${date}T12:00:00Z`);
  if (grain === "month") {
    return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(d);
  }
  const label = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
  return grain === "week" ? `Week of ${label}` : label;
}

function formatValue(title: string, value: number): string {
  const action = title.toLowerCase().replace(/^gifts?\s*/, "");
  return `${value.toLocaleString()} gift${value === 1 ? "" : "s"} ${action}`;
}
