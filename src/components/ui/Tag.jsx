import s from "./Tag.module.css";

export default function Tg({ t, gold, icon, color }) {
  if (color) {
    return (
      <span className={s.tag} style={{ background: `${color}20`, color }}>
        {icon && <span className={s.icon}>{icon}</span>}
        {t}
      </span>
    );
  }
  return (
    <span className={`${s.tag} ${gold ? s.gold : ""}`}>
      {t}
    </span>
  );
}
