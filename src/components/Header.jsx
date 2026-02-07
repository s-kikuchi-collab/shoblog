import s from "./Header.module.css";

export default function Header({ pg, setPg, tabs, onLogout, setEdit }) {
  return (
    <header className={s.header}>
      <div className={s.logo} onClick={() => setPg("home")}>
        <div className={s.logoIcon}>翔豊</div>
        <div>
          <div className={s.logoTitle}>SHOBLOG</div>
          <div className={s.logoSub}>Dining Concierge</div>
        </div>
      </div>
      <nav className={s.nav}>
        {tabs.map(([k, la]) => (
          <button
            key={k}
            onClick={() => { setPg(k); setEdit(null); }}
            className={`${s.tab} ${pg === k ? s.tabActive : ""}`}
          >
            {la}
          </button>
        ))}
        {onLogout && (
          <button onClick={onLogout} className={s.logoutBtn}>
            ログアウト
          </button>
        )}
      </nav>
    </header>
  );
}
