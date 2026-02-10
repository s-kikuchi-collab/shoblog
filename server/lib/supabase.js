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
    .neq("status", "deleted")
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

async function deleteReservation(id) {
  const { error } = await supabase
    .from("reservations")
    .update({ status: "deleted" })
    .eq("id", id);

  if (error) throw error;
}

async function deleteAllReservations() {
  const { error } = await supabase
    .from("reservations")
    .update({ status: "deleted" })
    .neq("status", "deleted");

  if (error) throw error;
}

// --- Bookings (新・予約管理) ---

async function getBookings() {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("date", { ascending: true });

  if (error) throw error;
  return data;
}

async function insertBooking(b) {
  const { data, error } = await supabase
    .from("bookings")
    .insert({
      shop: b.shop,
      date: b.date,
      time: b.time || "19:00",
      people: b.people || 2,
      purpose: b.purpose || "",
      who: b.who || "shobu",
      status: "upcoming",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function updateBooking(id, fields) {
  const { data, error } = await supabase
    .from("bookings")
    .update(fields)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function deleteBooking(id) {
  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

module.exports = {
  supabase,
  insertReservation, getReservations, updateReservationStatus, deleteReservation, deleteAllReservations,
  getBookings, insertBooking, updateBooking, deleteBooking,
};
