/**
 * The shared SVG shapes the redesign layer draws with: two brush strokes for
 * <Mark> and two torn paper edges for <PhotoBand>.
 *
 * Mounted once per redesigned page by <RedesignShell>. Every <Mark> / <TornEdge>
 * references these by id through <use>, so the path data ships once rather than
 * per instance.
 */
export function RedesignDefs() {
  return (
    <svg width="0" height="0" aria-hidden focusable="false" style={{ position: "absolute" }}>
      <defs>
        <path
          id="sk-brush"
          d="M2.4,7.9 C46,3.1 97,1.8 152,2.8 C199,3.6 246,6.1 297.6,3.4 C252,10.6 203,11.9 150,10.9 C95,9.9 47,10.5 2.4,7.9 Z"
        />
        <path
          id="sk-brush2"
          d="M1.8,8.4 C52,2.6 108,4.2 163,3.1 C214,2.1 258,5.4 298.2,2.9 C255,9.9 209,10.4 156,11.2 C104,12 52,11.1 1.8,8.4 Z"
        />
        <path
          id="sk-tear-top"
          d="M0,0 H1440 V16 C1352,29 1298,11 1214,21 C1130,31 1074,14 988,25 C902,36 848,15 762,24 C676,33 614,12 528,23 C442,34 388,15 302,26 C216,37 158,16 74,25 C48,28 24,31 0,29 Z"
        />
        <path
          id="sk-tear-bot"
          d="M0,44 H1440 V16 C1360,4 1300,25 1216,15 C1132,5 1078,26 992,17 C906,8 846,29 760,20 C674,11 616,30 530,21 C444,12 386,31 300,22 C214,13 156,32 72,23 C46,20 24,17 0,19 Z"
        />
      </defs>
    </svg>
  );
}
