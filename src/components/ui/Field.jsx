import s from "./Field.module.css";
import shared from "../../styles/shared.module.css";

export default function Fd({ label, val, set, type, opts, ph }) {
  return (
    <div className={s.field}>
      {label && <label className={s.label}>{label}</label>}
      {type === "select" ? (
        <select value={val} onChange={(e) => set(e.target.value)} className={shared.input}>
          <option value="">--</option>
          {opts.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : type === "check" ? (
        <label className={s.checkLabel}>
          <input type="checkbox" checked={val} onChange={(e) => set(e.target.checked)} />
          {ph}
        </label>
      ) : (
        <input
          type={type || "text"}
          value={val}
          onChange={(e) => set(type === "number" ? Number(e.target.value) : e.target.value)}
          placeholder={ph || ""}
          className={shared.input}
        />
      )}
    </div>
  );
}
