import s from "./Header.module.css";

const TABS = [
  { id: "search", label: "選ぶ", icon: "🔍", defaultPg: "home" },
  { id: "schedule", label: "予定", icon: "📅", defaultPg: "reservations" },
  { id: "log", label: "記録", icon: "📝", defaultPg: "logs" },
  { id: "manage", label: "管理", icon: "⚙️", defaultPg: "manage" },
];

const PG_TAB = {
  home: "search", results: "search",
  reservations: "schedule",
  logs: "log", add: "log",
  manage: "manage", analysis: "manage",
};

export default function Header({ pg, setPg, onLogout, setEdit }) {
  const activeTab = PG_TAB[pg] || "search";

  const go = (tab) => {
    const t = TABS.find((x) => x.id === tab);
    if (t) { setPg(t.defaultPg); setEdit(null); }
  };

  return (
    <>
      {/* Desktop header */}
      <header className={s.header}>
        <div className={s.logo} onClick={() => setPg("home")}>
          <div className={s.logoIcon}>翔豊</div>
          <div>
            <div className={s.logoTitle}>SHOBLOG</div>
            <div className={s.logoSub}>Dining Concierge</div>
          </div>
        </div>
        <nav className={s.desktopNav}>
          <div className={s.tabBar}>
            {TABS.map((t) => (
              <button key={t.id} onClick={() => go(t.id)}
                className={`${s.dtTab} ${activeTab === t.id ? s.dtTabActive : ""}`}>
                {t.label}
              </button>
            ))}
          </div>
          {onLogout && (
            <button onClick={onLogout} className={s.logoutBtn}>ログアウト</button>
          )}
        </nav>
      </header>

      {/* Mobile bottom nav */}
      <nav className={s.bottomNav}>
        {TABS.map((t) => (
          <button key={t.id} onClick={() => go(t.id)}
            className={`${s.bnTab} ${activeTab === t.id ? s.bnTabActive : ""}`}>
            {activeTab === t.id && <div className={s.bnIndicator} />}
            <span className={s.bnIcon}>{t.icon}</span>
            <span className={s.bnLabel}>{t.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
