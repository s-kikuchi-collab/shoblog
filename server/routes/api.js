const express = require("express");
const { getReservations, updateReservationStatus } = require("../lib/supabase");

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

module.exports = router;
