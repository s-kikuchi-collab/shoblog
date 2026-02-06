/**
 * LINEメッセージから予約情報を抽出する
 *
 * 対応フォーマット:
 *   予約 焼肉ホルモン金樹 2/15 19:00 4名
 *   2月15日 19時 焼肉ホルモン金樹 4人
 *   焼肉ホルモン金樹 明日 19:00 4名
 *   予約 焼肉ホルモン金樹 2月15日 19時30分 4名
 */

// 日付パターン
const DATE_PATTERNS = [
  // 2025/2/15, 2025-2-15
  /(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/,
  // 2/15, 2-15
  /(\d{1,2})[\/\-](\d{1,2})(?![:\d])/,
  // 2月15日
  /(\d{1,2})月(\d{1,2})日/,
  // 明日, 明後日, 今日
  /(今日|明日|明後日)/,
];

// 時間パターン
const TIME_PATTERNS = [
  // 19:00, 19:30
  /(\d{1,2}):(\d{2})/,
  // 19時30分, 19時半
  /(\d{1,2})時(\d{1,2})分/,
  /(\d{1,2})時半/,
  // 19時
  /(\d{1,2})時/,
];

// 人数パターン
const PARTY_PATTERNS = [
  /(\d{1,2})\s*[名人]/,
];

// 「予約」キーワードを除去して店名を抽出するための除外ワード
const STOP_WORDS = [
  "予約", "よやく", "お願い", "おねがい", "したい", "します", "でお願い",
  "名", "人", "時", "分", "半", "月", "日", "今日", "明日", "明後日",
];

function parseDate(text) {
  const today = new Date();

  // 2025/2/15 or 2025-2-15
  let m = text.match(/(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);
  if (m) return `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;

  // 2/15 or 2-15 (年なし → 次に来るその日付)
  m = text.match(/(?<!\d[:\d])(\d{1,2})[\/\-](\d{1,2})(?![:\d])/);
  if (m) {
    let year = today.getFullYear();
    const d = new Date(year, parseInt(m[1]) - 1, parseInt(m[2]));
    if (d < today) d.setFullYear(year + 1);
    return fmt(d);
  }

  // 2月15日
  m = text.match(/(\d{1,2})月(\d{1,2})日/);
  if (m) {
    let year = today.getFullYear();
    const d = new Date(year, parseInt(m[1]) - 1, parseInt(m[2]));
    if (d < today) d.setFullYear(year + 1);
    return fmt(d);
  }

  // 今日/明日/明後日
  m = text.match(/(今日|明日|明後日)/);
  if (m) {
    const d = new Date(today);
    if (m[1] === "明日") d.setDate(d.getDate() + 1);
    else if (m[1] === "明後日") d.setDate(d.getDate() + 2);
    return fmt(d);
  }

  return null;
}

function parseTime(text) {
  // 19:30
  let m = text.match(/(\d{1,2}):(\d{2})/);
  if (m) return `${m[1].padStart(2, "0")}:${m[2]}`;

  // 19時30分
  m = text.match(/(\d{1,2})時(\d{1,2})分/);
  if (m) return `${m[1].padStart(2, "0")}:${m[2].padStart(2, "0")}`;

  // 19時半
  m = text.match(/(\d{1,2})時半/);
  if (m) return `${m[1].padStart(2, "0")}:30`;

  // 19時
  m = text.match(/(\d{1,2})時/);
  if (m) return `${m[1].padStart(2, "0")}:00`;

  return null;
}

function parsePartySize(text) {
  const m = text.match(/(\d{1,2})\s*[名人]/);
  return m ? parseInt(m[1]) : null;
}

function parseRestaurant(text) {
  // 数字・日時・人数・予約キーワードを除去して残った部分を店名とする
  let cleaned = text
    .replace(/(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/g, "")
    .replace(/(\d{1,2})[\/\-](\d{1,2})/g, "")
    .replace(/(\d{1,2})月(\d{1,2})日/g, "")
    .replace(/(今日|明日|明後日)/g, "")
    .replace(/(\d{1,2}):(\d{2})/g, "")
    .replace(/(\d{1,2})時(\d{1,2})分/g, "")
    .replace(/(\d{1,2})時半/g, "")
    .replace(/(\d{1,2})時/g, "")
    .replace(/(\d{1,2})\s*[名人]/g, "")
    .replace(/予約/g, "")
    .replace(/よやく/g, "")
    .replace(/お願い(します)?/g, "")
    .replace(/したい/g, "")
    .replace(/でお願い/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned || null;
}

function parseMessage(text) {
  if (!text || typeof text !== "string") return null;

  const date = parseDate(text);
  const time = parseTime(text);
  const partySize = parsePartySize(text);
  const restaurant = parseRestaurant(text);

  // 最低限、店名と日付があれば予約として扱う
  if (!restaurant || !date) return null;

  return {
    restaurant,
    date,
    time: time || "未定",
    partySize: partySize || null,
  };
}

function fmt(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatConfirmation(parsed, reservationId) {
  const lines = [
    "✅ 予約を受け付けました",
    "",
    `📍 ${parsed.restaurant}`,
    `📅 ${parsed.date} ${parsed.time}`,
  ];
  if (parsed.partySize) lines.push(`👥 ${parsed.partySize}名`);
  lines.push("", "ステータス: 確認中");
  if (reservationId) lines.push(`予約ID: #${reservationId.slice(0, 8)}`);
  return lines.join("\n");
}

function formatError() {
  return [
    "予約内容を読み取れませんでした。",
    "以下の形式で送信してください：",
    "",
    "予約 [店名] [日付] [時間] [人数]",
    "",
    "例:",
    "予約 焼肉ホルモン金樹 2/15 19:00 4名",
    "焼肉ホルモン金樹 明日 19時 4人",
  ].join("\n");
}

module.exports = { parseMessage, formatConfirmation, formatError };
