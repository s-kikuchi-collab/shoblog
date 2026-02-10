export const GENRES = [
  "すべて", "焼肉", "寿司", "和食", "中華", "イタリアン", "フレンチ",
  "焼き鳥", "鉄板焼き", "ステーキ", "韓国料理", "居酒屋", "バー", "串揚げ", "蕎麦", "天ぷら",
  "カフェ", "デザート", "洋食", "バル", "フュージョン", "その他",
];

export const AM = [
  "六本木", "銀座", "虎ノ門", "麻布十番", "麻布", "広尾", "赤坂",
  "南青山", "白金", "三田", "四谷", "日比谷", "代官山", "恵比寿",
  "目黒", "中目黒", "渋谷", "新橋", "神宮前", "日本橋",
];

export const RG = {
  北海道: ["札幌", "旭川", "ニセコ", "北海道"],
  北陸: ["金沢", "富山", "福井", "石川", "北陸"],
  名古屋: ["名古屋"],
  京都: ["京都"],
  大阪: ["大阪"],
  福岡: ["福岡"],
};

export const RGA = Object.values(RG).flat();

export const AREAS = ["すべて", ...AM, "北海道", "北陸", "名古屋", "京都", "大阪", "福岡", "その他（地方）"];

export const AREA_GROUPS = [
  { label: "六本木・麻布・三田", color: "#C4A474", areas: ["六本木", "麻布十番", "麻布", "虎ノ門", "三田", "赤羽橋", "白金"] },
  { label: "銀座・新橋", color: "#2E86AB", areas: ["銀座", "新橋", "日比谷", "日本橋"] },
  { label: "赤坂・青山", color: "#27AE60", areas: ["赤坂", "外苑前", "表参道"] },
  { label: "恵比寿・広尾", color: "#8E44AD", areas: ["広尾", "恵比寿", "代官山", "目黒", "中目黒"] },
  { label: "渋谷・新宿", color: "#E67E22", areas: ["渋谷", "新宿", "代々木", "四谷", "神楽坂"] },
  { label: "関東その他", color: "#78909C", areas: ["東京その他", "埼玉", "千葉", "神奈川"] },
  { label: "地方", color: "#D4A017", areas: [
    { name: "北海道", icon: "🦀" }, { name: "北陸", icon: "🌊" }, { name: "名古屋", icon: "🏯" },
    { name: "京都", icon: "⛩️" }, { name: "大阪", icon: "🐙" }, { name: "福岡", icon: "🍜" },
    { name: "その他（地方）", icon: "📍" },
  ]},
];

export const ATMS = [
  "すべて", "落ち着き", "活気", "高級感", "隠れ家", "カジュアル", "モダン", "暗め", "大将癖あり", "大将キレ気味",
];

export const ATMOSPHERE_STYLES = {
  "すべて": "#C4A474",
  "落ち着き": "#5D7B93",
  "活気": "#E74C3C",
  "高級感": "#C4A474",
  "隠れ家": "#6C3483",
  "カジュアル": "#27AE60",
  "モダン": "#2E86AB",
  "暗め": "#37474F",
  "大将癖あり": "#E65100",
  "大将キレ気味": "#C0392B",
};

export const INTERIOR_OPTIONS = [
  { value: "any", label: "指定なし", icon: "🔓" },
  { value: "yes", label: "個室あり", icon: "🚪" },
  { value: "semi", label: "半個室あり", icon: "🪟" },
  { value: "group8", label: "8人同席対応可能", icon: "👥" },
  { value: "table", label: "テーブル", icon: "🍽️" },
  { value: "counter", label: "カウンター", icon: "🪑" },
];

export const PRICE_OPTIONS = [
  { value: "any", label: "指定なし", icon: "💴", color: "#C4A474" },
  { value: "5-6千円未満", label: "5-6千円未満", icon: "🪙", color: "#27AE60" },
  { value: "1万円ぐらい", label: "1万円ぐらい", icon: "💰", color: "#2E86AB" },
  { value: "2万円-3万円", label: "2万円-3万円", icon: "💎", color: "#8E44AD" },
  { value: "4万円以上", label: "4万円以上", icon: "👑", color: "#E74C3C" },
];

export const PURPOSE_OPTIONS = [
  { value: "any", label: "指定なし", icon: "🍺", color: "#27AE60" },
  { value: "entertainment", label: "接待・会食", icon: "🤝", color: "#C4A474" },
  { value: "date", label: "デート", icon: "💕", color: "#E91E63" },
  { value: "celebration", label: "記念日", icon: "🎂", color: "#9C27B0" },
  { value: "solo", label: "1人向け", icon: "🧘", color: "#607D8B" },
  { value: "cospa", label: "コスパ向け", icon: "💰", color: "#FF9800" },
  { value: "luxury", label: "高級", icon: "👑", color: "#FFD700" },
  { value: "lastsupper", label: "最後の晩餐", icon: "✨", color: "#E74C3C" },
  { value: "secret", label: "密会", icon: "🤫", color: "#37474F" },
];

export const SPECIALTY_OPTIONS = [
  { label: "アラカルト", icon: "📋", color: "#27AE60" },
  { label: "コースオンリー", icon: "🎯", color: "#2E86AB" },
  { label: "時間限定アラカルト", icon: "⏳", color: "#E67E22" },
  { label: "ワイン品揃え良い", icon: "🍷", color: "#AD1457" },
  { label: "日本酒豊富", icon: "🍶", color: "#5D7B93" },
  { label: "カクテル最高", icon: "🍸", color: "#6C3483" },
  { label: "つまみといえば", icon: "🥜", color: "#8D6E63" },
  { label: "締めの王様", icon: "🍙", color: "#D4A017" },
  { label: "カスタマイズ可能", icon: "🔧", color: "#607D8B" },
  { label: "デザートオンリー", icon: "🍰", color: "#E91E63" },
  { label: "会員制", icon: "🔑", color: "#37474F" },
  { label: "カラオケ", icon: "🎤", color: "#9C27B0" },
];

export const PRICE_PER_PERSON = [
  "10,000円以下", "15,000円", "20,000円", "25,000円",
  "30,000円", "40,000円", "50,000円", "60,000円以上",
];

export const HOURS_OPTIONS = [
  { value: "any", label: "指定なし", icon: "⏰", color: "#C4A474" },
  { value: "22時以降可能", label: "22時以降可能", icon: "🌙", color: "#5D7B93" },
  { value: "24時以降可能", label: "24時以降可能", icon: "🌃", color: "#6C3483" },
  { value: "日曜営業", label: "日曜営業", icon: "☀️", color: "#E67E22" },
];

export const GENRE_STYLES = {
  "焼肉": { icon: "🥩", color: "#E74C3C" },
  "日本料理": { icon: "🍱", color: "#2E86AB" },
  "寿司": { icon: "🍣", color: "#E67E22" },
  "イタリアン": { icon: "🍝", color: "#27AE60" },
  "中華": { icon: "🥟", color: "#C0392B" },
  "焼き鳥": { icon: "🍗", color: "#D4A017" },
  "フレンチ": { icon: "🥐", color: "#8E44AD" },
  "居酒屋": { icon: "🏮", color: "#E65100" },
  "バー": { icon: "🥃", color: "#6C3483" },
  "鉄板焼": { icon: "🔥", color: "#E65100" },
  "鉄板焼き": { icon: "🔥", color: "#E65100" },
  "天ぷら": { icon: "🍤", color: "#F9A825" },
  "うなぎ": { icon: "🐟", color: "#5D4037" },
  "カレー": { icon: "🍛", color: "#FF8F00" },
  "デザート": { icon: "🍰", color: "#E91E63" },
  "韓国料理": { icon: "🥘", color: "#FF5722" },
  "スペイン料理": { icon: "🫒", color: "#689F38" },
  "ステーキ": { icon: "🥩", color: "#8D6E63" },
  "そば": { icon: "🍜", color: "#795548" },
  "蕎麦": { icon: "🍜", color: "#795548" },
  "とんかつ": { icon: "🐷", color: "#EF6C00" },
  "和食": { icon: "🍱", color: "#2E86AB" },
  "串揚げ": { icon: "🍢", color: "#BF8C00" },
  "カフェ": { icon: "☕", color: "#6D4C41" },
  "洋食": { icon: "🍽️", color: "#5C6BC0" },
  "バル": { icon: "🍷", color: "#AD1457" },
  "フュージョン": { icon: "✨", color: "#7E57C2" },
};

const GENRE_DEFAULT = { icon: "🍽️", color: "#9E9E9E" };

export function getGenreStyle(genre) {
  return GENRE_STYLES[genre] || GENRE_DEFAULT;
}

export const PRS = ["5-6千円未満", "1万円ぐらい", "2万円-3万円", "4万円以上"];

export const HOURS = ["22時以降可能", "24時以降可能", "日曜営業"];
