import { getGenreStyle } from "../lib/constants";
import Tg from "./ui/Tag";
import RestThumb from "./ui/RestThumb";
import EditForm from "./ui/EditForm";
import shared from "../styles/shared.module.css";
import s from "./ManagePage.module.css";

export default function ManagePage({
  db, fDb, mf, setMf, edit, setEdit, saveEdit, delRest, resetDb,
  cfm, setCfm, mSel, setMSel, logs, delLog, exportDb, importDb, TOT, busy,
}) {
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
                  v: 1, g: "", pr: "中", l: "", img: "", url: "",
                  purp: [], spec: [], _new: true,
                })
              }
              className={`${shared.link} ${s.addBtn}`}
            >
              ＋ 新規店舗
            </button>
          </div>
          <div className={s.restGrid}>
            {fDb.map((r) => {
              const rLogs = logs
                .filter((x) => x.name === r.n)
                .sort((a, b) => (a.date > b.date ? -1 : 1));
              const isOpen = mSel === r.id;
              return (
                <div
                  key={r.id}
                  className={`${s.restCard} ${isOpen ? s.restCardOpen : ""}`}
                >
                  <div className={s.restHeader}>
                    <RestThumb img={r.img} genre={r.g} />
                    <div
                      className={s.restInfo}
                      onClick={() => setMSel(isOpen ? null : r.id)}
                    >
                      <div className={s.restNameRow}>
                        {r.url ? (
                          <strong
                            className={`${s.restName} ${s.restNameLink}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(r.url, "_blank", "noopener,noreferrer");
                            }}
                          >
                            {r.n}<span className={s.extIcon}>↗</span>
                          </strong>
                        ) : (
                          <strong className={s.restName}>{r.n}</strong>
                        )}
                        <Tg t={r.v + "回"} gold />
                        {rLogs.length > 0 && <Tg t={"ログ" + rLogs.length + "件"} />}
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
                        <Tg t={r.pr} />
                      </div>
                    </div>
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
                  </div>
                  {isOpen && (
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
