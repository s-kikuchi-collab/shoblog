import SEED from "./seed.json";
import TABELOG from "./tabelog-data.json";

const AREA_MAP = {
  "西麻布": "麻布",
  "東麻布": "麻布",
  "南麻布": "麻布",
  "有楽町": "日比谷",
  "丸の内": "日比谷",
  "荒木町": "四谷",
};

function normalizeArea(a) {
  return a.split("/").map((s) => {
    const t = s.trim();
    return AREA_MAP[t] || t;
  }).join("/");
}

function toObj(d) {
  const tb = TABELOG[d[0]] || {};
  return {
    n: d[0], a: normalizeArea(d[1]), f: d[2], m: d[3], p: !!d[4], v: d[5],
    g: d[6], pr: d[7], l: d[8] ? "24時以降可能" : "", id: d[0] + "_" + d[5],
    img: tb.img || "", url: tb.url || "",
    pn: 0, spec: [],
  };
}

export const INIT_DB = SEED.map(toObj);
