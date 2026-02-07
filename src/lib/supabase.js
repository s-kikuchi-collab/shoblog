import { createClient } from "@supabase/supabase-js";

export const SB_URL = "https://ivugdechzfwvgmwethii.supabase.co";
export const SB_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2dWdkZWNoemZ3dmdtd2V0aGlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNjY2ODAsImV4cCI6MjA4NTg0MjY4MH0.hKhlyCofcoT4UHxQ0TproYoX_ZQ-se2sb9E0fHnm-pw";

const sbH = {
  "Content-Type": "application/json",
  apikey: SB_KEY,
  Authorization: "Bearer " + SB_KEY,
};

export async function sbGet(key) {
  const r = await fetch(
    SB_URL + "/rest/v1/app_data?key=eq." + encodeURIComponent(key) + "&select=value",
    { headers: sbH }
  );
  if (!r.ok) throw new Error("データの取得に失敗しました");
  const d = await r.json();
  return d && d[0] ? d[0].value : null;
}

export async function sbSet(key, value) {
  const r = await fetch(SB_URL + "/rest/v1/app_data", {
    method: "POST",
    headers: { ...sbH, Prefer: "resolution=merge-duplicates" },
    body: JSON.stringify({ key, value, updated_at: new Date().toISOString() }),
  });
  if (!r.ok) throw new Error("データの保存に失敗しました");
}

export const sb = createClient(SB_URL, SB_KEY);
