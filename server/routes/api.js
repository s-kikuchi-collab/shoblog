const express = require("express");
const {
  getReservations, updateReservationStatus, deleteReservation, deleteAllReservations,
  getBookings, insertBooking, updateBooking, deleteBooking,
  getLogs, insertLog, deleteLog,
} = require("../lib/supabase");

const router = express.Router();

// 予約一覧取得
router.get("/reservations", async (req, res) => {
  try {
    const { status, search, limit, offset } = req.query;
    const result = await getReservations({
      status: status || "all",
      search: search || "",
      limit: parseInt(limit) || 50,
      offset: parseInt(offset) || 0,
    });
    res.json(result);
  } catch (err) {
    console.error("予約一覧取得エラー:", err);
    res.status(500).json({ error: "予約一覧の取得に失敗しました" });
  }
});

// 予約ステータス更新
router.patch("/reservations/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({ error: "無効なステータスです" });
    }

    const data = await updateReservationStatus(id, status);
    res.json(data);
  } catch (err) {
    console.error("ステータス更新エラー:", err);
    res.status(500).json({ error: "ステータスの更新に失敗しました" });
  }
});

// 予約削除
router.delete("/reservations/:id", async (req, res) => {
  try {
    await deleteReservation(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error("予約削除エラー:", err);
    res.status(500).json({ error: "予約の削除に失敗しました" });
  }
});

// 予約全件削除
router.delete("/reservations", async (req, res) => {
  try {
    await deleteAllReservations();
    res.json({ ok: true });
  } catch (err) {
    console.error("予約全削除エラー:", err);
    res.status(500).json({ error: "予約の全削除に失敗しました" });
  }
});

// --- Bookings (新・予約管理) ---

router.get("/bookings", async (req, res) => {
  try {
    const data = await getBookings();
    res.json(data);
  } catch (err) {
    console.error("予約一覧取得エラー:", err);
    res.status(500).json({ error: "予約の取得に失敗しました" });
  }
});

router.post("/bookings", async (req, res) => {
  try {
    const data = await insertBooking(req.body);
    res.json(data);
  } catch (err) {
    console.error("予約追加エラー:", err);
    res.status(500).json({ error: "予約の追加に失敗しました" });
  }
});

router.patch("/bookings/:id", async (req, res) => {
  try {
    const data = await updateBooking(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    console.error("予約更新エラー:", err);
    res.status(500).json({ error: "予約の更新に失敗しました" });
  }
});

router.delete("/bookings/:id", async (req, res) => {
  try {
    await deleteBooking(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error("予約削除エラー:", err);
    res.status(500).json({ error: "予約の削除に失敗しました" });
  }
});

// --- Dining Logs ---

router.get("/logs", async (req, res) => {
  try {
    const data = await getLogs();
    res.json(data);
  } catch (err) {
    console.error("ログ取得エラー:", err);
    res.status(500).json({ error: "ログの取得に失敗しました" });
  }
});

router.post("/logs", async (req, res) => {
  try {
    const data = await insertLog(req.body);
    res.json(data);
  } catch (err) {
    console.error("ログ追加エラー:", err);
    res.status(500).json({ error: "ログの追加に失敗しました", detail: err.message || String(err) });
  }
});

router.delete("/logs/:id", async (req, res) => {
  try {
    await deleteLog(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error("ログ削除エラー:", err);
    res.status(500).json({ error: "ログの削除に失敗しました" });
  }
});

module.exports = router;
