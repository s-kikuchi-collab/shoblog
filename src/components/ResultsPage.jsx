import { getGenreStyle } from "../lib/constants";
import Tg from "./ui/Tag";
import RestThumb from "./ui/RestThumb";
import shared from "../styles/shared.module.css";
import s from "./ResultsPage.module.css";

export default function ResultsPage({ pf, recs, cnt, setCnt, setPg, lb, sel, setSel }) {
  return (
    <div className={s.page}>
      <div className={s.titleWrap}>
        <h2 className={s.title}>おすすめ</h2>
        <p className={s.subtitle}>
          {(pf.genre !== "すべて" ? pf.genre + " " : "") +
            (pf.area !== "すべて" ? pf.area + " " : "")}
          {"— "}
          <strong className={s.subtitleCount}>{recs.length}件</strong>
        </p>
      </div>
      {recs.length === 0 ? (
        <div className={s.emptyWrap}>
          <p className={s.emptyIcon}>🍵</p>
          <p>条件に合うお店が見つかりませんでした。</p>
          <button onClick={() => setPg("home")} className={shared.link}>
            条件を変更
          </button>
        </div>
      ) : (
        <>
          <div className={s.grid}>
            {recs.slice(0, cnt).map((r, i) => (
              <div
                key={i}
                onClick={() => setSel(sel && sel.n === r.n ? null : r)}
                className={`${s.resultCard} ${sel && sel.n === r.n ? s.cardSelected : ""}`}
              >
                <div className={s.cardHeader}>
                  <RestThumb img={r.img} genre={r.g} size={56} />
                  <span className={`${s.rank} ${i < 3 ? s.rankTop : ""}`}>
                    {i + 1}
                  </span>
                  {r.url ? (
                    <strong
                      className={`${s.cardName} ${s.cardNameLink}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(r.url, "_blank", "noopener,noreferrer");
                      }}
                    >
                      {r.n}<span className={s.extIcon}>↗</span>
                    </strong>
                  ) : (
                    <strong className={s.cardName}>{r.n}</strong>
                  )}
                </div>
                <div className={s.tagRow}>
                  <Tg t={r.a} />
                  {r.g.split("/").map((gg) => {
                    const gs = getGenreStyle(gg);
                    return <Tg key={gg} t={gg} icon={gs.icon} color={gs.color} />;
                  })}
                  {r.p && <Tg t="個室" gold />}
                  {r.semi && <Tg t="半個室" gold />}
                  {r.g8 && <Tg t="8人可" gold />}
                  {r.l &&
                    String(r.l)
                      .split(" ")
                      .filter(Boolean)
                      .map((h) => <Tg key={h} t={h} />)}
                  <Tg t={r.tv + "回"} gold />
                  <Tg t={r.score + "pt"} />
                </div>
                <p className={s.desc}>{r.f}</p>
                {sel && sel.n === r.n && (
                  <div className={s.detail}>
                    <p className={s.detailLine}>🏠 雰囲気: {r.m}</p>
                    <p className={s.detailLine}>💰 価格帯: {r.pr}</p>
                    <p className={s.detailLineLast}>
                      📊 訪問: {r.v + "回"}
                      {(lb[r.n] || 0) > 0 ? " + ログ" + lb[r.n] + "回" : ""}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
          {cnt < recs.length && (
            <div className={s.moreWrap}>
              <button onClick={() => setCnt((c) => c + 20)} className={shared.link}>
                さらに表示（残り{recs.length - cnt}件）
              </button>
            </div>
          )}
          <div className={s.backWrap}>
            <button onClick={() => setPg("home")} className={shared.link}>
              条件を変更
            </button>
          </div>
        </>
      )}
    </div>
  );
}
