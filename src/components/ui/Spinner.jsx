import s from "./Spinner.module.css";

export default function Spinner({ size = "sm", label }) {
  return (
    <span className={s.wrap}>
      <span className={`${s.circle} ${size === "lg" ? s.lg : s.sm}`} />
      {label && <span className={s.label}>{label}</span>}
    </span>
  );
}
