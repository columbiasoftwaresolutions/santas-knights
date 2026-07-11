"use client";

import { useState } from "react";
import { updateUserRole } from "@/app/admin/content-actions";

export type UserRow = {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  createdAt: string;
  giftsSubmitted: number;
  giftsFulfilled: number;
};

const ROLES = ["public", "participant", "instructor", "admin"] as const;

/** Role label color in the collapsed row (no pill — plain colored text). */
const ROLE_TEXT: Record<string, string> = {
  admin: "text-[#e7705e]",
  instructor: "text-amber",
  participant: "text-green",
  public: "text-bone/55",
};

const ROW_GRID = "grid-cols-[minmax(0,1.2fr)_minmax(0,1.8fr)_auto_1.75rem]";

/**
 * Admin user roster. Collapsed rows show name / email / role; expanding a row
 * (chevron at right) reveals that person's activity and a role editor.
 */
export function UsersTable({ users }: { users: UserRow[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="overflow-hidden border border-bone/15 bg-ink2">
      <div
        className={`hidden gap-3 border-b border-bone/15 px-4 py-3 text-[11px] font-bold tracking-[0.1em] text-bone/45 uppercase sm:grid ${ROW_GRID}`}
      >
        <span>Name</span>
        <span>Email</span>
        <span>Role</span>
        <span className="sr-only">Expand</span>
      </div>

      {users.map((u) => {
        const open = openId === u.id;
        return (
          <div key={u.id} className="border-b border-bone/10 last:border-0">
            <button
              type="button"
              onClick={() => setOpenId(open ? null : u.id)}
              aria-expanded={open}
              className={`grid w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-bone/[0.03] ${ROW_GRID}`}
            >
              <span className="truncate font-semibold text-bone">{u.name ?? "—"}</span>
              <span className="truncate text-bone/70">{u.email ?? "—"}</span>
              <span
                className={`text-[12.5px] font-bold tracking-wide uppercase ${ROLE_TEXT[u.role] ?? "text-bone/70"}`}
              >
                {u.role}
              </span>
              <span
                aria-hidden
                className={`justify-self-end text-bone/50 transition-colors duration-200 ${open ? "rotate-180" : ""}`}
              >
                ▾
              </span>
            </button>

            {open && (
              <div className="border-t border-bone/10 bg-[#0f0c0a] px-4 py-5">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                  <dl className="grid grow grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
                    <Stat label="Gifts submitted" value={u.giftsSubmitted} />
                    <Stat label="Gifts fulfilled" value={u.giftsFulfilled} />
                    <Stat label="Joined" value={new Date(u.createdAt).toLocaleDateString()} />
                  </dl>

                  {/* Role editor: green square SAVE sits at the top-right, above
                      the transparent outlined dropdown. */}
                  <form
                    action={updateUserRole}
                    className="flex shrink-0 flex-col items-end gap-2.5 sm:w-[220px]"
                  >
                    <input type="hidden" name="email" value={u.email ?? ""} />
                    <button
                      type="submit"
                      className="cursor-pointer bg-green px-5 py-2 text-[12px] font-bold tracking-[0.08em] text-white uppercase transition-colors hover:bg-[#244c38]"
                    >
                      Save
                    </button>
                    <div className="relative w-full">
                      <span className="mb-1.5 block text-[10.5px] font-bold tracking-[0.1em] text-bone/40 uppercase">
                        Role / status
                      </span>
                      <select
                        name="role"
                        defaultValue={u.role}
                        className="w-full cursor-pointer appearance-none border border-white/50 bg-transparent px-3 py-2 pr-9 text-[14px] text-bone focus:border-white focus:outline-none"
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r} className="bg-ink text-bone">
                            {r}
                          </option>
                        ))}
                      </select>
                      <span
                        aria-hidden
                        className="pointer-events-none absolute right-3 bottom-2.5 text-bone/70"
                      >
                        ▾
                      </span>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div>
      <dt className="text-[10.5px] font-bold tracking-[0.1em] text-bone/40 uppercase">{label}</dt>
      <dd className="mt-0.5 text-[17px] font-extrabold text-bone">{value}</dd>
    </div>
  );
}
