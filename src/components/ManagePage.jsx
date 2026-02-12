import { getGenreStyle } from "../lib/constants";
import Tg from "./ui/Tag";
import RestThumb from "./ui/RestThumb";
import EditForm from "./ui/EditForm";
import shared from "../styles/shared.module.css";
import s from "./ManagePage.module.css";

export default function ManagePage({
  db, fDb, mf, setMf, edit, setEdit, saveEdit, delRest, resetDb,
  cfm, setCfm, mSel, setMSel, logs, delLog, exportDb, importDb, TOT, busy, lb,
  migrateImages, migrating, migrateProgress,
}) {
  // Sort by visit count (logs) descending
  const sorted = [...fDb].sort((a, b) => ((lb?.[b.n] || 0) + b.v) - ((lb?.[a.n] || 0) + a.v));
  return (
    <div className={s.page}>
      <div className={s.titleWrap}>
        <h2 className={s.title}>店舗データ管理</h2>
        <p className={s.subtitle}>{TOT}店舗 — 追加・編集・削除</p>
      </div>
      {edit ? (
        <EditForm
          edit={edit}
          setEdit={setEdit}
          saveEdit={saveEdit}
          onClose={() => setEdit(null)}
          busy={busy.saveEdit}
        />
      ) : (
        <>
          <div className={s.toolbar}>
            <input
              type="text"
              placeholder="店名・エリア・ジャンルで検索..."
              value={mf}
              onChange={(e) => setMf(e.target.value)}
              className={`${shared.input} ${s.searchInput}`}
            />
            <button
              onClick={() =>
                setEdit({
                  n: "", a: "", f: "", m: "", p: false, semi: false, g8: false,
                  v: 1, g: "", pr: "1万円ぐらい", l: "", img: "", url: "",
                  nk: "", purp: [], spec: [], _new: true,
                })
              }
              className={`${shared.link} ${s.addBtn}`}
            >
              ＋ 新規店舗
            </button>
            <button
              onClick={migrateImages}
              disabled={migrating}
              className={`${shared.link} ${s.migrateBtn}`}
            >
              {migrating ? migrateProgress : "📷 画像移行"}
            </button>
          </div>
          <div className={s.restGrid}>
            {sorted.map((r) => {
              const rLogs = logs
                .filter((x) => x.name === r.n)
                .sort((a, b) => (a.date > b.date ? -1 : 1));
              const isOpen = mSel === r.id;
              return (
                <div
                  key={r.id}
                  className={`${s.restCard} ${isOpen ? s.restCardOpen : ""}`}
                >
                  {/* 常に表示: 写真・名前・回数 */}
                  <div
                    className={s.restHeader}
                    onClick={() => setMSel(isOpen ? null : r.id)}
                  >
                    <RestThumb img={r.img} genre={r.g} />
                    <div className={s.restInfo}>
                      <strong className={s.restName}>{r.n}</strong>
                    </div>
                    <Tg t={r.v + "回"} gold />
                    <span className={s.chevron}>{isOpen ? "▾" : "▸"}</span>
                  </div>

                  {/* 展開時: 詳細・ボタン・ログ */}
                  {isOpen && (
                    <div className={s.detailSection}>
                      <div className={s.tagRow}>
                        <Tg t={r.a} />
                        {r.g.split("/").map((gg) => {
                          const gs = getGenreStyle(gg);
                          return <Tg key={gg} t={gg} icon={gs.icon} color={gs.color} />;
                        })}
                        {r.p && <Tg t="個室" gold />}
                        {r.semi && <Tg t="半個室" gold />}
                        {r.g8 && <Tg t="8人可" gold />}
                        {r.tbl && <Tg t="テーブル" />}
                        {r.cnt && <Tg t="カウンター" />}
                        {r.l &&
                          String(r.l)
                            .split(" ")
                            .filter(Boolean)
                            .map((h) => <Tg key={h} t={h} />)}
                        <Tg t={r.pr} />
                      </div>
                      {r.url && (
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={s.urlLink}
                        >
                          {r.url.replace(/^https?:\/\//, "").slice(0, 40)}↗
                        </a>
                      )}
                      <div className={s.btnGroup}>
                        <button onClick={() => setEdit({ ...r })} className={s.editBtn}>
                          編集
                        </button>
                        {cfm === r.id ? (
                          <>
                            <button
                              onClick={() => { delRest(r.id); setCfm(null); }}
                              disabled={busy.delRest}
                              className={`${s.confirmBtn} ${busy.delRest ? s.confirmBtnBusy : ""}`}
                            >
                              {busy.delRest ? "削除中..." : "確定"}
                            </button>
                            <button onClick={() => setCfm(null)} className={s.cancelSmBtn}>
                              戻る
                            </button>
                          </>
                        ) : (
                          <button onClick={() => setCfm(r.id)} className={s.delBtn}>
                            削除
                          </button>
                        )}
                      </div>

                      <div className={s.logSection}>
                        <div className={s.logSectionTitle}>訪問履歴</div>
                        {rLogs.length === 0 ? (
                          <p className={s.logEmpty}>まだ訪問記録がありません</p>
                        ) : (
                          <div className={s.logGrid}>
                            {rLogs.map((lg) => (
                              <div key={lg.id} className={s.logEntry}>
                                <div className={s.logEntryInfo}>
                                  <span className={s.logDate}>{lg.date}</span>
                                  <span className={s.logRating}>
                                    {"★".repeat(lg.rating || 0)}
                                  </span>
                                  {lg.note && (
                                    <span className={s.logNote}>{lg.note}</span>
                                  )}
                                </div>
                                <button
                                  onClick={() => delLog(lg.id)}
                                  disabled={busy.delLog}
                                  className={`${s.logDelBtn} ${busy.delLog ? s.logDelBtnBusy : ""}`}
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
