import s from "./Bar.module.css";

export default function Br({ label, val, max, top }) {
  return (
    <div className={s.bar}>
      <div className={s.header}>
        <span className={s.headerLabel}>{label}</span>
        <span className={s.headerVal}>{val + "回"}</span>
      </div>
      <div className={s.track}>
        <div
          className={`${s.fill} ${top ? s.fillTop : ""}`}
          style={{ width: (val / (max || 1)) * 100 + "%" }}
        />
      </div>
    </div>
  );
}
