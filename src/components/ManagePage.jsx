import { GENRES, PRS, HOURS, getGenreStyle } from "../lib/constants";
import Tg from "./ui/Tag";
import { Ch } from "./ui/Chip";
import Fd from "./ui/Field";
import RestThumb from "./ui/RestThumb";
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
        <div className={s.editForm}>
          <div className={s.editHeader}>
            <h3 className={s.editTitle}>
              {edit._new ? "新規店舗追加" : "店舗情報を編集"}
            </h3>
            <button onClick={() => setEdit(null)} className={s.closeBtn}>
              ✕
            </button>
          </div>
          <Fd label="店名 *" val={edit.n} set={(v) => setEdit((e) => ({ ...e, n: v }))} ph="店名を入力" />
          <div className={s.twoCol}>
            <Fd label="エリア" val={edit.a} set={(v) => setEdit((e) => ({ ...e, a: v }))} ph="六本木" />
            <div style={{ marginBottom: 10 }}>
              <label className={s.genreLabel}>ジャンル（複数選択可）</label>
            </div>
          </div>
          <div className={s.genreWrap}>
            {GENRES.filter((g) => g !== "すべて").map((g) => {
              const gs = getGenreStyle(g);
              return (
                <Ch
                  key={g}
                  label={g}
                  active={(edit.g || "").split("/").includes(g)}
                  onClick={() => {
                    const arr = (edit.g || "").split("/").filter(Boolean);
                    setEdit((e) => ({
                      ...e,
                      g: arr.includes(g)
                        ? arr.filter((x) => x !== g).join("/")
                        : [...arr, g].join("/"),
                    }));
                  }}
                  icon={gs.icon}
                  color={gs.color}
                />
              );
            })}
          </div>
          <Fd
            label="特徴・説明"
            val={edit.f}
            set={(v) => setEdit((e) => ({ ...e, f: v }))}
            ph="お店の特徴"
          />
          <Fd
            label="雰囲気キーワード（スペース区切り）"
            val={edit.m}
            set={(v) => setEdit((e) => ({ ...e, m: v }))}
            ph="落ち着き 高級感 モダン"
          />
          <div className={s.twoCol}>
            <Fd
              label="価格帯"
              val={edit.pr}
              set={(v) => setEdit((e) => ({ ...e, pr: v }))}
              type="select"
              opts={PRS}
            />
            <Fd
              label="訪問回数"
              val={edit.v}
              set={(v) => setEdit((e) => ({ ...e, v: v }))}
              type="number"
            />
          </div>
          <div className={s.checkGroup}>
            <Fd label="" val={edit.p} set={(v) => setEdit((e) => ({ ...e, p: v }))} type="check" ph="個室あり" />
            <Fd label="" val={edit.semi} set={(v) => setEdit((e) => ({ ...e, semi: v }))} type="check" ph="半個室あり" />
            <Fd label="" val={edit.g8} set={(v) => setEdit((e) => ({ ...e, g8: v }))} type="check" ph="8人同席対応可能" />
          </div>
          <Fd
            label="画像URL"
            val={edit.img || ""}
            set={(v) => setEdit((e) => ({ ...e, img: v }))}
            ph="https://example.com/photo.jpg"
          />
          <Fd
            label="外部リンク（食べログ等）"
            val={edit.url || ""}
            set={(v) => setEdit((e) => ({ ...e, url: v }))}
            ph="https://tabelog.com/..."
          />
          <div className={s.hoursGroup}>
            <label className={s.hoursLabel}>営業時間</label>
            <div className={s.hoursWrap}>
              {HOURS.map((h) => (
                <Ch
                  key={h}
                  label={h}
                  active={(edit.l || "").includes(h)}
                  onClick={() => {
                    const cur = edit.l || "";
                    setEdit((e) => ({
                      ...e,
                      l: cur.includes(h)
                        ? cur.split(" ").filter((x) => x !== h).join(" ")
                        : (cur ? cur + " " : "") + h,
                    }));
                  }}
                />
              ))}
            </div>
          </div>
          <button
            onClick={saveEdit}
            disabled={!edit.n || busy.saveEdit}
            className={`${s.saveBtn} ${!edit.n || busy.saveEdit ? s.saveBtnDisabled : ""} ${busy.saveEdit ? s.saveBtnBusy : ""}`}
          >
            {busy.saveEdit ? "保存中..." : edit._new ? "追加する" : "保存する"}
          </button>
        </div>
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
                  v: 1, g: "", pr: "中", l: "", img: "", url: "", _new: true,
                })
              }
              className={`${shared.link} ${s.addBtn}`}
            >
              ＋ 新規店舗
            </button>
            <button
              onClick={() => {
                if (cfm === "reset") { resetDb(); setCfm(null); } else setCfm("reset");
              }}
              disabled={busy.resetDb}
              className={`${shared.link} ${s.resetBtn} ${cfm === "reset" ? s.resetBtnConfirm : ""} ${busy.resetDb ? s.resetBtnBusy : ""}`}
            >
              {busy.resetDb ? "初期化中..." : cfm === "reset" ? "本当にリセット？" : "初期化"}
            </button>
            {cfm === "reset" && (
              <button onClick={() => setCfm(null)} className={`${shared.link} ${s.cancelBtn}`}>
                キャンセル
              </button>
            )}
            <button onClick={exportDb} className={`${shared.link} ${s.exportBtn}`}>
              📤 エクスポート
            </button>
            <label
              className={`${shared.link} ${s.importLabel} ${busy.importDb ? s.importLabelBusy : ""}`}
            >
              {busy.importDb ? "📥 インポート中..." : "📥 インポート"}
              <input type="file" accept=".json" onChange={importDb} disabled={busy.importDb} style={{ display: "none" }} />
            </label>
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
