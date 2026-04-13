import { createClient } from "@supabase/supabase-js";
import { SUPABASE_CONFIG } from "./system-config";

export const supabase = createClient(
  SUPABASE_CONFIG.URL,
  SUPABASE_CONFIG.ANON_KEY
);

export type UserRow = {
  pi_uid: string;
  username: string;
  streak_days: number;
  best_streak: number;
  last_session_date: string;
  total_minutes: number;
  total_sessions: number;
  tree_stage: number;
  created_at: string;
};

export type SessionRow = {
  id?: string;
  pi_uid: string;
  technique_name: string;
  duration_seconds: number;
  completed: boolean;
  mood_before: number;
  mood_after: number;
  created_at?: string;
};

export async function getOrCreateUser(pi_uid: string, username: string): Promise<UserRow> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("pi_uid", pi_uid)
    .single();

  if (data) return data;

  const newUser: UserRow = {
    pi_uid, username,
    streak_days: 0, best_streak: 0,
    last_session_date: "",
    total_minutes: 0, total_sessions: 0,
    tree_stage: 0,
    created_at: new Date().toISOString(),
  };

  await supabase.from("users").insert(newUser);
  return newUser;
}

export async function saveSession(session: SessionRow) {
  await supabase.from("sessions").insert(session);
}

export async function updateUserAfterSession(
  pi_uid: string,
  durationSeconds: number,
  techniqueName: string
) {
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("pi_uid", pi_uid)
    .single();

  if (!user) return;

  const today = new Date().toISOString().split("T")[0];
  const lastDate = user.last_session_date;
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  let newStreak = user.streak_days;
  if (lastDate === today) {
    // already counted today
  } else if (lastDate === yesterday) {
    newStreak = user.streak_days + 1;
  } else {
    newStreak = 1;
  }

  const newBest = Math.max(newStreak, user.best_streak);
  const newMinutes = user.total_minutes + Math.round(durationSeconds / 60);
  const newSessions = user.total_sessions + 1;

  let treeStage = 0;
  if (newStreak >= 61) treeStage = 5;
  else if (newStreak >= 31) treeStage = 4;
  else if (newStreak >= 15) treeStage = 3;
  else if (newStreak >= 8) treeStage = 2;
  else if (newStreak >= 4) treeStage = 1;

  await supabase.from("users").update({
    streak_days: newStreak,
    best_streak: newBest,
    last_session_date: today,
    total_minutes: newMinutes,
    total_sessions: newSessions,
    tree_stage: treeStage,
  }).eq("pi_uid", pi_uid);
}

export async function getRecentSessions(pi_uid: string, days = 30): Promise<SessionRow[]> {
  const from = new Date(Date.now() - days * 86400000).toISOString();
  const { data } = await supabase
    .from("sessions")
    .select("*")
    .eq("pi_uid", pi_uid)
    .gte("created_at", from)
    .order("created_at", { ascending: false });
  return data || [];
}
