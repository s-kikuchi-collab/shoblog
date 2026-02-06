const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function insertReservation(data) {
  const { data: row, error } = await supabase
    .from("reservations")
    .insert({
      line_user_id: data.lineUserId,
      line_display_name: data.displayName,
      restaurant_name: data.restaurant,
      date: data.date,
      time: data.time,
      party_size: data.partySize,
      raw_message: data.rawMessage,
      status: "pending",
      note: data.note || "",
    })
    .select()
    .single();

  if (error) throw error;
  return row;
}

async function getReservations({ status, search, limit = 50, offset = 0 }) {
  let query = supabase
    .from("reservations")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status && status !== "all") {
    query = query.eq("status", status);
  }
  if (search) {
    query = query.or(
      `restaurant_name.ilike.%${search}%,line_display_name.ilike.%${search}%`
    );
  }

  const { data, error, count } = await query;
  if (error) throw error;
  return { data, count };
}

async function updateReservationStatus(id, status) {
  const { data, error } = await supabase
    .from("reservations")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

module.exports = { supabase, insertReservation, getReservations, updateReservationStatus };
