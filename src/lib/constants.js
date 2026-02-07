export const GENRES = [
  "すべて", "焼肉", "寿司", "日本料理", "和食", "中華", "イタリアン", "フレンチ",
  "焼き鳥", "鉄板焼き", "ステーキ", "韓国料理", "バー", "串揚げ", "蕎麦", "天ぷら",
  "カフェ", "デザート", "洋食", "バル", "フュージョン", "その他",
];

export const AM = [
  "六本木", "銀座", "虎ノ門", "麻布十番", "西麻布", "東麻布", "広尾", "赤坂",
  "南青山", "白金", "三田", "四谷", "有楽町", "日比谷", "代官山", "恵比寿",
  "丸の内", "目黒", "渋谷", "新橋", "荒木町", "南麻布", "神宮前", "日本橋",
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

export const ATMS = [
  "すべて", "落ち着き", "活気", "高級感", "隠れ家", "カジュアル", "モダン", "洗練", "重厚", "シック", "大将癖あり", "大将キレ気味",
];

export const GENRE_STYLES = {
  "焼肉": { icon: "🥩", color: "#E74C3C" },
  "日本料理": { icon: "🍱", color: "#2E86AB" },
  "寿司": { icon: "🍣", color: "#E67E22" },
  "イタリアン": { icon: "🍝", color: "#27AE60" },
  "中華": { icon: "🥟", color: "#C0392B" },
  "焼き鳥": { icon: "🍗", color: "#D4A017" },
  "フレンチ": { icon: "🥐", color: "#8E44AD" },
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

export const PRS = ["中", "中〜高", "高"];

export const HOURS = ["22時以降可能", "24時以降可能", "日曜営業"];
