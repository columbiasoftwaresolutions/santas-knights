import { RedesignDefs } from "@/components/redesign/Defs";
import { RedesignParallax } from "@/components/redesign/Parallax";

/**
 * Opts a page into the redesign system.
 *
 * The redesign is landing page by page, so its CSS (app/redesign.css) is scoped
 * under `.rd` and only reaches what this wraps. Everything else keeps the old
 * poster system until it's ported. Wrapping a page is the whole opt-in:
 *
 *     export default function Page() {
 *       return <RedesignShell>…</RedesignShell>;
 *     }
 *
 * Ported so far: every public-facing page. Only /admin/* is still on the old
 * poster system — see the Status table in design-demos/REDESIGN-SYSTEM.md,
 * which is the source of truth for what is left.
 *
 * When the last page is ported, this component and the `.rd` scope both go
 * away — see design-demos/REDESIGN-SYSTEM.md for the exact removal steps.
 */
export function RedesignShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="rd">
      <RedesignDefs />
      <RedesignParallax />
      {children}
    </div>
  );
}

/** The redesign's page column (1240px). Narrower than the old Container. */
export function Wrap({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`rd-wrap${className ? ` ${className}` : ""}`}>{children}</div>;
}
