import s from "./Card.module.css";
import shared from "../../styles/shared.module.css";

export default function Crd({ title, children }) {
  return (
    <div className={shared.card}>
      <div className={s.title}>{title}</div>
      {children}
    </div>
  );
}
