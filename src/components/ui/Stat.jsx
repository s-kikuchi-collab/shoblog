import s from "./Stat.module.css";

export default function St({ label, val }) {
  return (
    <div className={s.stat}>
      <div className={s.val}>{val}</div>
      <div className={s.label}>{label}</div>
    </div>
  );
}
