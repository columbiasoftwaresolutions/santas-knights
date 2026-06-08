import { cn } from "@/lib/cn";

const HATCH_LIGHT =
  "repeating-linear-gradient(135deg,#EBE0CB 0 14px,#E3D6BD 14px 28px)";
const HATCH_DARK =
  "repeating-linear-gradient(135deg,#212327 0 14px,#282b30 14px 28px)";

/**
 * Image stand-in until real photography lands. The `label` documents the
 * intended shot — mirrors the `data-label` placeholders in the design mock.
 */
export function Placeholder({
  label,
  dark = false,
  className,
}: {
  label: string;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "relative overflow-hidden border",
        dark ? "border-[#33363c]" : "border-line",
        className,
      )}
      style={{ background: dark ? HATCH_DARK : HATCH_LIGHT }}
    >
      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center p-[18px] text-center font-mono text-xs uppercase leading-normal tracking-wide",
          dark ? "text-[#7f8590]" : "text-[#9a8a6c]",
        )}
      >
        {label}
      </span>
    </div>
  );
}
