import s from "./Chip.module.css";

export function Ch({ label, active, onClick, icon, color }) {
  const hasGenre = !!color;
  const style = hasGenre
    ? active
      ? { background: color, color: "#fff", boxShadow: `0 2px 12px ${color}40`, borderColor: "transparent" }
      : {}
    : undefined;

  return (
    <button
      onClick={onClick}
      className={`${s.chip} ${active ? s.active : ""} ${hasGenre ? s.genre : ""} ${hasGenre && active ? s.genreActive : ""}`}
      style={style}
    >
      {icon && <span className={s.icon}>{icon}</span>}
      {label}
    </button>
  );
}

export function Chs({ items, val, set, kv }) {
  const list = kv ? items : items.map((i) => [i, i]);
  return (
    <div className={s.list}>
      {list.map(([k, la]) => (
        <Ch key={String(k)} label={la} active={val === k} onClick={() => set(k)} />
      ))}
    </div>
  );
}
