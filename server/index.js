require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { middleware: lineMiddleware } = require("./lib/line");
const webhookRouter = require("./routes/webhook");
const apiRouter = require("./routes/api");

const app = express();
const PORT = process.env.PORT || 3000;

// CORS（管理画面からのAPI呼び出し用）
app.use(cors());

// LINE Webhook（署名検証のためraw bodyが必要 → json parseの前に設定）
app.use("/webhook", lineMiddleware, webhookRouter);

// その他のルートはJSON parse
app.use(express.json());
app.use("/api", apiRouter);

// ヘルスチェック
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`SHOBLOG LINE予約サーバー起動 → http://localhost:${PORT}`);
  console.log(`  Webhook URL: http://localhost:${PORT}/webhook`);
  console.log(`  API URL:     http://localhost:${PORT}/api/reservations`);
});
