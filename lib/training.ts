import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { TRAINING_VIDEOS_BUCKET } from "@/lib/supabase/config";
import { resolveLevel, type Level, type LevelProgress } from "@/lib/xp";
import { LIABILITY_WAIVER_VERSION } from "@/content/consent";

export type ClassSession = {
  id: string;
  title: string;
  slug: string | null;
  class_type: string;
  description: string | null;
  location: string | null;
  starts_at: string;
  ends_at: string | null;
  capacity: number;
  requires_approval: boolean;
  registered: number;
  spotsLeft: number;
  isFull: boolean;
};

const ACTIVE_REG = ["registered", "attended"];

/** Published, future class sessions with live registration counts. */
export async function getUpcomingClasses(): Promise<ClassSession[]> {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return [];

  const nowIso = new Date().toISOString();
  const { data: classes, error } = await supabase
    .from("classes")
    .select("id, title, slug, class_type, description, location, starts_at, ends_at, capacity, requires_approval")
    .eq("is_published", true)
    .gte("starts_at", nowIso)
    .order("starts_at", { ascending: true })
    .limit(100);
  if (error || !classes) {
    if (error) console.error("getUpcomingClasses:", error.message);
    return [];
  }

  const ids = classes.map((c) => c.id);
  const counts = new Map<string, number>();
  if (ids.length) {
    const { data: regs } = await supabase
      .from("registrations")
      .select("class_id")
      .in("class_id", ids)
      .in("status", ACTIVE_REG);
    regs?.forEach((r) => counts.set(r.class_id, (counts.get(r.class_id) ?? 0) + 1));
  }

  return classes.map((c) => {
    const registered = counts.get(c.id) ?? 0;
    const spotsLeft = Math.max(0, c.capacity - registered);
    return { ...c, registered, spotsLeft, isFull: spotsLeft === 0 };
  });
}

export type WaiverStatus = { signed: boolean; currentVersion: boolean };

/** Whether the user has any waiver on file, and whether it's the current version. */
export async function getWaiverStatus(userId: string): Promise<WaiverStatus> {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return { signed: false, currentVersion: false };
  const { data } = await supabase
    .from("waivers")
    .select("version")
    .eq("user_id", userId)
    .is("family_member_id", null)
    .order("signed_at", { ascending: false })
    .limit(1);
  const latest = data?.[0]?.version as string | undefined;
  return { signed: Boolean(latest), currentVersion: latest === LIABILITY_WAIVER_VERSION };
}

export type MyRegistration = {
  id: string;
  status: string;
  class: { id: string; title: string; starts_at: string; location: string | null } | null;
};

export async function getMyRegistrations(userId: string): Promise<MyRegistration[]> {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("registrations")
    .select("id, status, class:classes(id, title, starts_at, location)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(100);
  // Supabase types the embedded relation as an array; normalize to a single object.
  return (data ?? []).map((r) => ({
    id: r.id as string,
    status: r.status as string,
    class: Array.isArray(r.class) ? (r.class[0] ?? null) : (r.class ?? null),
  }));
}

export type Dashboard = {
  totalXp: number;
  level: LevelProgress;
  attendance: number;
  badges: { code: string; name: string; icon: string | null }[];
  waiver: WaiverStatus;
  armorEligible: boolean;
  /** Classes attended still needed before the participant can request armor. */
  armorClassesNeeded: number;
};

/** Minimum attended classes before a participant may *request* armor rental.
 *  This only unlocks the request; the rental itself still requires instructor
 *  certification and happens on the commercial Armory (gladiators.nyc). */
const ARMOR_REQUEST_MIN_CLASSES = 5;

export async function getDashboard(userId: string): Promise<Dashboard> {
  const empty: Dashboard = {
    totalXp: 0,
    level: resolveLevel(0, []),
    attendance: 0,
    badges: [],
    waiver: { signed: false, currentVersion: false },
    armorEligible: false,
    armorClassesNeeded: ARMOR_REQUEST_MIN_CLASSES,
  };
  const supabase = createSupabaseAdminClient();
  if (!supabase) return empty;

  const [{ data: xpRows }, { data: levelRows }, { data: checkRows }, { data: badgeRows }, waiver] =
    await Promise.all([
      supabase.from("xp_events").select("xp_value").eq("user_id", userId).is("family_member_id", null),
      supabase.from("levels").select("name, threshold, unlock").eq("track", "fighter"),
      supabase.from("checkins").select("id").eq("user_id", userId).is("family_member_id", null),
      supabase
        .from("participant_badges")
        .select("badge:badges(code, name, icon)")
        .eq("user_id", userId)
        .is("family_member_id", null),
      getWaiverStatus(userId),
    ]);

  const totalXp = (xpRows ?? []).reduce((s, r) => s + (r.xp_value ?? 0), 0);
  const levels = (levelRows ?? []) as Level[];
  const attendance = (checkRows ?? []).length;
  const badges = (badgeRows ?? []).map((b) => {
    const badge = Array.isArray(b.badge) ? b.badge[0] : b.badge;
    return { code: badge?.code as string, name: badge?.name as string, icon: (badge?.icon as string) ?? null };
  });
  const armorClassesNeeded = Math.max(0, ARMOR_REQUEST_MIN_CLASSES - attendance);
  const armorEligible = waiver.signed && attendance >= ARMOR_REQUEST_MIN_CLASSES;

  return {
    totalXp,
    level: resolveLevel(totalXp, levels),
    attendance,
    badges,
    waiver,
    armorEligible,
    armorClassesNeeded,
  };
}

export type RosterEntry = {
  registrationId: string;
  userId: string;
  email: string | null;
  status: string;
  checkedIn: boolean;
};

/** Roster for a class: registrations + whether each is already checked in. */
export async function getClassRoster(classId: string): Promise<RosterEntry[]> {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return [];
  const { data: regs } = await supabase
    .from("registrations")
    .select("id, user_id, status, profile:profiles(email)")
    .eq("class_id", classId)
    .neq("status", "cancelled")
    .order("created_at", { ascending: true });
  if (!regs) return [];

  const { data: checks } = await supabase
    .from("checkins")
    .select("user_id")
    .eq("class_id", classId)
    .is("family_member_id", null);
  const checkedIn = new Set((checks ?? []).map((c) => c.user_id));

  return regs.map((r) => {
    const profile = Array.isArray(r.profile) ? r.profile[0] : r.profile;
    return {
      registrationId: r.id as string,
      userId: r.user_id as string,
      email: (profile?.email as string) ?? null,
      status: r.status as string,
      checkedIn: checkedIn.has(r.user_id),
    };
  });
}

export type TrainingVideo = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  /** Resolved playback URL: signed (private bucket) or external. */
  url: string | null;
};

/** Published Strength & Conditioning videos with playback URLs. Storage-backed
 *  videos live in the private `training-videos` bucket and get short-lived
 *  signed URLs; external_url rows pass through (e.g. YouTube). */
export async function getTrainingVideos(): Promise<TrainingVideo[]> {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("training_videos")
    .select("id, title, description, category, storage_path, external_url")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(200);
  if (!data) return [];

  const paths = data.map((v) => v.storage_path).filter(Boolean) as string[];
  const signed = new Map<string, string>();
  if (paths.length) {
    const { data: urls } = await supabase.storage
      .from(TRAINING_VIDEOS_BUCKET)
      .createSignedUrls(paths, 60 * 60 * 2);
    urls?.forEach((u) => u.path && u.signedUrl && signed.set(u.path, u.signedUrl));
  }

  return data.map((v) => ({
    id: v.id,
    title: v.title,
    description: v.description,
    category: v.category,
    url: v.storage_path ? (signed.get(v.storage_path) ?? null) : (v.external_url ?? null),
  }));
}

export type GrantRow = {
  email: string | null;
  role: string;
  veteran: boolean;
  totalXp: number;
  attendance: number;
  waiverSignedAt: string | null;
  joinedAt: string;
};

/** Participant roster aggregated for grant reporting: XP, attendance, veteran
 *  status. Used by the admin grants table and the CSV export. */
export async function getGrantRows(): Promise<GrantRow[]> {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return [];

  const [{ data: profiles }, { data: xp }, { data: checks }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, email, role, veteran_status, waiver_signed_at, created_at")
      .in("role", ["participant", "instructor", "admin"]),
    supabase.from("xp_events").select("user_id, xp_value").is("family_member_id", null),
    supabase.from("checkins").select("user_id").is("family_member_id", null),
  ]);

  const xpByUser = new Map<string, number>();
  xp?.forEach((r) => xpByUser.set(r.user_id, (xpByUser.get(r.user_id) ?? 0) + (r.xp_value ?? 0)));
  const checksByUser = new Map<string, number>();
  checks?.forEach((r) => checksByUser.set(r.user_id, (checksByUser.get(r.user_id) ?? 0) + 1));

  return (profiles ?? [])
    .map((p) => ({
      email: p.email as string | null,
      role: p.role as string,
      veteran: Boolean(p.veteran_status),
      totalXp: xpByUser.get(p.id) ?? 0,
      attendance: checksByUser.get(p.id) ?? 0,
      waiverSignedAt: (p.waiver_signed_at as string) ?? null,
      joinedAt: p.created_at as string,
    }))
    .sort((a, b) => b.totalXp - a.totalXp);
}

export type CheckinClass = { id: string; title: string; class_type: string; starts_at: string; location: string | null };

/** Classes in the check-in window (yesterday → next 14 days) for staff to pick. */
export async function getClassesForCheckin(): Promise<CheckinClass[]> {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return [];
  const from = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  const to = new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString();
  const { data } = await supabase
    .from("classes")
    .select("id, title, class_type, starts_at, location")
    .gte("starts_at", from)
    .lte("starts_at", to)
    .order("starts_at", { ascending: true });
  return (data ?? []) as CheckinClass[];
}
