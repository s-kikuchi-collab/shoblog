const express = require("express");
const { replyText, getProfile } = require("../lib/line");
const { parseMessage, formatConfirmation, formatError } = require("../lib/parser");
const { insertReservation } = require("../lib/supabase");

const router = express.Router();

router.post("/", async (req, res) => {
  // LINE Platformに200を即返す
  res.status(200).json({ status: "ok" });

  const events = req.body.events || [];

  for (const event of events) {
    if (event.type !== "message" || event.message.type !== "text") continue;

    const text = event.message.text;
    const userId = event.source.userId;
    const replyToken = event.replyToken;

    try {
      const parsed = parseMessage(text);

      if (!parsed) {
        await replyText(replyToken, formatError());
        continue;
      }

      const displayName = await getProfile(userId);

      const row = await insertReservation({
        lineUserId: userId,
        displayName,
        restaurant: parsed.restaurant,
        date: parsed.date,
        time: parsed.time,
        partySize: parsed.partySize,
        rawMessage: text,
      });

      await replyText(replyToken, formatConfirmation(parsed, row.id));
    } catch (err) {
      console.error("Webhook処理エラー:", err);
      try {
        await replyText(replyToken, "エラーが発生しました。もう一度お試しください。");
      } catch {}
    }
  }
});

module.exports = router;
