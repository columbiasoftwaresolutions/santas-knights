import { checkAdmin } from "@/lib/auth";
import { getGrantRows } from "@/lib/training";

export const dynamic = "force-dynamic";

/** CSV escape: wrap in quotes and double internal quotes. */
function cell(value: string | number | boolean | null): string {
  const s = value === null ? "" : String(value);
  return `"${s.replace(/"/g, '""')}"`;
}

/** CSV export of the participant grant dataset. Admin-only. */
export async function GET() {
  const admin = await checkAdmin();
  if (admin.status !== "admin") {
    return new Response("Forbidden", { status: 403 });
  }

  const rows = await getGrantRows();
  const header = ["Email", "Role", "Veteran", "Total XP", "Attendance", "Waiver signed", "Joined"];
  const lines = [
    header.map(cell).join(","),
    ...rows.map((r) =>
      [
        cell(r.email),
        cell(r.role),
        cell(r.veteran ? "Yes" : "No"),
        cell(r.totalXp),
        cell(r.attendance),
        cell(r.waiverSignedAt ? new Date(r.waiverSignedAt).toISOString().slice(0, 10) : ""),
        cell(new Date(r.joinedAt).toISOString().slice(0, 10)),
      ].join(","),
    ),
  ];
  const csv = lines.join("\r\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="gladiators-grant-export.csv"`,
    },
  });
}
