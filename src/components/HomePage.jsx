import {
  GENRES, AREA_GROUPS, ATMS, ATMOSPHERE_STYLES, INTERIOR_OPTIONS,
  PRICE_OPTIONS, PURPOSE_OPTIONS, SPECIALTY_OPTIONS, HOURS_OPTIONS,
  getGenreStyle,
} from "../lib/constants";
import { Ch } from "./ui/Chip";
import s from "./HomePage.module.css";

function Section({ icon, title, children }) {
  return (
    <div className={s.section}>
      <div className={s.secHeader}>
        {icon && <span className={s.secIcon}>{icon}</span>}
        <span>{title}</span>
      </div>
      {children}
    </div>
  );
}

function ColorPill({ label, icon, color, active, onClick }) {
  return (
    <button
      className={`${s.pill} ${active ? s.pillActive : ""}`}
      style={active ? { background: color, color: "#fff", boxShadow: `0 2px 12px ${color}40` } : undefined}
      onClick={onClick}
    >
      {icon && <span className={s.pillIcon}>{icon}</span>}
      {label}
    </button>
  );
}

function InteriorCard({ icon, label, active, onClick }) {
  return (
    <button
      className={`${s.intCard} ${active ? s.intCardActive : ""}`}
      onClick={onClick}
    >
      <span className={s.intIcon}>{icon}</span>
      <span className={s.intLabel}>{label}</span>
    </button>
  );
}

export default function HomePage({ pf, setPf, doSearch, TOT }) {
  const toggleSpec = (label) => {
    setPf((p) => {
      const cur = p.spec || [];
      return { ...p, spec: cur.includes(label) ? cur.filter((x) => x !== label) : [...cur, label] };
    });
  };

  return (
    <div className={s.page}>
      <div className={s.titleWrap}>
        <h1 className={s.title}>今宵の一軒</h1>
        <p className={s.subtitle}>全{TOT}店からお好みで検索</p>
      </div>
      <div className={s.grid}>

        {/* 料理ジャンル */}
        <Section icon="🍽" title="料理ジャンル">
          <div className={s.pills}>
            <Ch label="すべて" active={pf.genre === "すべて"} onClick={() => setPf((p) => ({ ...p, genre: "すべて" }))} />
            {GENRES.filter((g) => g !== "すべて").map((g) => {
              const gs = getGenreStyle(g);
              return (
                <Ch key={g} label={g} active={pf.genre === g}
                  onClick={() => setPf((p) => ({ ...p, genre: g }))} icon={gs.icon} color={gs.color} />
              );
            })}
          </div>
        </Section>

        {/* エリア */}
        <Section icon="📍" title="エリア">
          <div className={s.areaWrap}>
            <ColorPill label="すべて" color="#C4A474" active={pf.area === "すべて"}
              onClick={() => setPf((p) => ({ ...p, area: "すべて" }))} />
            {AREA_GROUPS.map((grp) => (
              <div key={grp.label} className={s.areaGroup}>
                <div className={s.areaGroupLabel} style={{ color: grp.color }}>{grp.label}</div>
                <div className={s.areaGroupPills}>
                  {grp.areas.map((area) => {
                    const name = typeof area === "string" ? area : area.name;
                    const icon = typeof area === "object" ? area.icon : undefined;
                    return (
                      <ColorPill key={name} label={name} icon={icon} color={grp.color}
                        active={pf.area === name}
                        onClick={() => setPf((p) => ({ ...p, area: name }))} />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* 店内要素 */}
        <Section icon="🚪" title="店内要素">
          <div className={s.intGrid}>
            {INTERIOR_OPTIONS.map((opt) => (
              <InteriorCard key={opt.value} icon={opt.icon} label={opt.label}
                active={pf.priv === opt.value}
                onClick={() => setPf((p) => ({ ...p, priv: opt.value }))} />
            ))}
          </div>
        </Section>

        {/* 価格帯 */}
        <Section icon="💴" title="価格帯（1人単価・料理）">
          <div className={s.pills}>
            {PRICE_OPTIONS.map((opt) => (
              <ColorPill key={opt.value} label={opt.label} icon={opt.icon} color={opt.color}
                active={pf.price === opt.value}
                onClick={() => setPf((p) => ({ ...p, price: opt.value }))} />
            ))}
          </div>
        </Section>

        {/* 雰囲気 */}
        <Section icon="✨" title="雰囲気">
          <div className={s.pills}>
            {ATMS.map((a) => {
              const color = ATMOSPHERE_STYLES[a] || "#C4A474";
              return (
                <ColorPill key={a} label={a} color={color}
                  active={pf.atmo === a}
                  onClick={() => setPf((p) => ({ ...p, atmo: a }))} />
              );
            })}
          </div>
        </Section>

        {/* 利用シーン */}
        <Section icon="🎯" title="利用シーン">
          <div className={s.pills}>
            {PURPOSE_OPTIONS.map((opt) => (
              <ColorPill key={opt.value} label={opt.label} icon={opt.icon} color={opt.color}
                active={pf.purp === opt.value}
                onClick={() => setPf((p) => ({ ...p, purp: opt.value }))} />
            ))}
          </div>
        </Section>

        {/* 特性 */}
        <Section icon="🏷️" title="特性">
          <div className={s.pills}>
            {SPECIALTY_OPTIONS.map((opt) => (
              <ColorPill key={opt.label} label={opt.label} icon={opt.icon} color={opt.color}
                active={(pf.spec || []).includes(opt.label)}
                onClick={() => toggleSpec(opt.label)} />
            ))}
          </div>
        </Section>

        {/* 営業時間 */}
        <Section icon="🕰️" title="営業時間">
          <div className={s.pills}>
            {HOURS_OPTIONS.map((opt) => (
              <ColorPill key={opt.value} label={opt.label} icon={opt.icon} color={opt.color}
                active={pf.hours === opt.value}
                onClick={() => setPf((p) => ({ ...p, hours: opt.value }))} />
            ))}
          </div>
        </Section>

      </div>
      <div style={{ textAlign: "center", marginTop: 32 }}>
        <button onClick={doSearch} className={s.searchBtn}>
          おすすめを見る
        </button>
      </div>
    </div>
  );
}
