import { useState } from "react";
import { getGenreStyle } from "../../lib/constants";
import s from "./RestThumb.module.css";

export default function RestThumb({ img, genre, size = 48 }) {
  const [err, setErr] = useState(false);
  const gs = getGenreStyle((genre || "").split("/")[0]);
  const cls = size > 48 ? `${s.wrap} ${s.lg}` : s.wrap;

  if (img && !err) {
    return (
      <div className={cls}>
        <img src={img} alt="" className={s.img} onError={() => setErr(true)} />
      </div>
    );
  }
  return (
    <div className={`${cls} ${s.placeholder}`}>
      <span className={s.icon}>{gs.icon}</span>
    </div>
  );
}
