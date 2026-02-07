import SEED from "./seed.json";
import TABELOG from "./tabelog-data.json";

function toObj(d) {
  const tb = TABELOG[d[0]] || {};
  return {
    n: d[0], a: d[1], f: d[2], m: d[3], p: !!d[4], v: d[5],
    g: d[6], pr: d[7], l: d[8] ? "24時以降可能" : "", id: d[0] + "_" + d[5],
    img: tb.img || "", url: tb.url || "",
  };
}

export const INIT_DB = SEED.map(toObj);
