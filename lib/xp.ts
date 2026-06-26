import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * XP engine. All XP values, level names, and thresholds are admin-editable data
 * in `xp_config` / `levels` — never hardcoded here (see docs/GLADIATORS-SITE.md).
 * This module just reads that config and writes the immutable `xp_events` ledger.
 *
 * Safety invariant: XP can make a participant *eligible to request* a privilege,
 * but never auto-grants safety-sensitive access. Eligibility is computed; the
 * certification stays a human instructor/admin action.
 */

export type Level = { name: string; threshold: number; unlock: string | null };

export type LevelProgress = {
  total: number;
  current: Level;
  next: Level | null;
  /** 0–100 progress toward the next level. */
  percent: number;
};

/** Resolve a total XP value to its current + next level on a track. */
export function resolveLevel(total: number, levels: Level[]): LevelProgress {
  const sorted = [...levels].sort((a, b) => a.threshold - b.threshold);
  const fallback: Level = { name: "Recruit", threshold: 0, unlock: null };
  let current = sorted[0] ?? fallback;
  let next: Level | null = null;
  for (let i = 0; i < sorted.length; i++) {
    if (total >= sorted[i].threshold) {
      current = sorted[i];
      next = sorted[i + 1] ?? null;
    } else {
      next = sorted[i];
      break;
    }
  }
  const span = next ? next.threshold - current.threshold : 0;
  const into = total - current.threshold;
  const percent = next && span > 0 ? Math.min(100, Math.round((into / span) * 100)) : 100;
  return { total, current, next, percent };
}

type AwardArgs = {
  userId: string;
  familyMemberId?: string | null;
  eventType: string;
  sourceType?: string;
  sourceId?: string | null;
  note?: string | null;
  createdBy?: string | null;
};

/**
 * Award XP for an event by looking up its configured value. Returns the XP
 * granted (0 if the event type is inactive/unknown). Writes one ledger row.
 * Callers are responsible for not double-awarding one-time events.
 */
export async function awardXp(supabase: SupabaseClient, args: AwardArgs): Promise<number> {
  const { data: config } = await supabase
    .from("xp_config")
    .select("xp_value, track, is_active")
    .eq("event_type", args.eventType)
    .maybeSingle();

  if (!config || config.is_active === false) return 0;
  const xp = config.xp_value as number;

  const { error } = await supabase.from("xp_events").insert({
    user_id: args.userId,
    family_member_id: args.familyMemberId ?? null,
    event_type: args.eventType,
    xp_value: xp,
    track: config.track ?? "fighter",
    source_type: args.sourceType ?? null,
    source_id: args.sourceId ?? null,
    note: args.note ?? null,
    created_by: args.createdBy ?? null,
  });
  if (error) {
    console.error("awardXp insert failed:", error.message);
    return 0;
  }
  return xp;
}

/** Grant a badge by code if the participant doesn't already hold it. */
export async function grantBadge(
  supabase: SupabaseClient,
  userId: string,
  code: string,
  familyMemberId?: string | null,
  awardedBy?: string | null,
): Promise<void> {
  const { data: badge } = await supabase.from("badges").select("id").eq("code", code).maybeSingle();
  if (!badge) return;
  // Unique index on (badge_id, user_id, coalesce(family_member_id, zero)) makes this idempotent.
  await supabase
    .from("participant_badges")
    .insert({
      badge_id: badge.id,
      user_id: userId,
      family_member_id: familyMemberId ?? null,
      awarded_by: awardedBy ?? null,
    })
    .select()
    .maybeSingle();
}
