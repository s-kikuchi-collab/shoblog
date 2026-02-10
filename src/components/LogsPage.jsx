import { useState, useMemo } from "react";
import RestThumb from "./ui/RestThumb";
import LogEntryForm from "./ui/LogEntryForm";
import shared from "../styles/shared.module.css";
import s from "./LogsPage.module.css";

export default function LogsPage({ logs, fLogs, lf, setLf, setPg, delLog, updateLog, busy, db }) {
  const [editId, setEditId] = useState(null);
  const [delCfm, setDelCfm] = useState(null);
  const [openId, setOpenId] = useState(null);

  const dbMap = useMemo(() => {
    const m = {};
    (db || []).forEach((r) => { m[r.n] = r; });
    return m;
  }, [db]);

  const handleUpdate = async (id, logData) => {
    await updateLog(id, logData);
    setEditId(null);
  };

  return (
    <div className={s.page}>
      <div className={s.titleWrap}>
        <h2 className={s.title}>訪問記録</h2>
        <p className={s.subtitle}>{logs.length}件</p>
      </div>
      <input
        type="text"
        placeholder="検索..."
        value={lf}
        onChange={(e) => setLf(e.target.value)}
        className={`${shared.input} ${s.searchInput}`}
      />
      {fLogs.length === 0 ? (
        <div className={s.emptyWrap}>
          <p>{logs.length === 0 ? "まだ記録がありません。" : "一致なし"}</p>
          <button onClick={() => setPg("add")} className={shared.link}>
            ログを追加
          </button>
        </div>
      ) : (
        <div className={s.grid}>
          {fLogs.map((x) => {
            const rest = dbMap[x.name];
            if (editId === x.id) {
              return (
                <div key={x.id} className={s.logItem}>
                  <LogEntryForm
                    defaultShop={x.name}
                    defaultDate={x.date}
                    defaultWho={x.who}
                    defaultPurpose={x.purpose}
                    defaultPeople={x.people}
                    defaultRating={x.rating}
                    defaultMemo={x.note}
                    defaultPricePerPerson={x.price_per_person}
                    onSave={(data) => handleUpdate(x.id, data)}
                    onCancel={() => setEditId(null)}
                    db={db}
                    busy={busy.updateLog}
                  />
                </div>
              );
            }
            const isOpen = openId === x.id;
            return (
              <div key={x.id} className={`${s.logItem} ${isOpen ? s.logItemOpen : ""}`}
                onClick={() => setOpenId(isOpen ? null : x.id)}>
                <div className={s.logDateBar}>
                  <span className={s.logDate}>{x.date}</span>
                  <span className={s.logRating}>{"★".repeat(x.rating || 0)}</span>
                </div>
                <div className={s.logRow}>
                  <RestThumb img={rest?.img} genre={x.genre || rest?.g} size={56} />
                  <div className={s.logContent}>
                    <span className={s.logName}>{x.name}</span>
                    <div className={s.logMeta}>
                      {x.purpose && <span className={s.metaItem}>{x.purpose}</span>}
                      {x.people && <span className={s.metaItem}>{x.people}名</span>}
                    </div>
                  </div>
                </div>
                {isOpen && (
                  <div className={s.detailSection} onClick={(e) => e.stopPropagation()}>
                    {x.price_per_person && (
                      <div className={s.detailRow}>
                        <span className={s.detailLabel}>単価</span>
                        <span className={s.detailValue}>{x.price_per_person}</span>
                      </div>
                    )}
                    {x.who && (
                      <div className={s.detailRow}>
                        <span className={s.detailLabel}>入力者</span>
                        <span className={s.detailValue}>{x.who}</span>
                      </div>
                    )}
                    {x.note && (
                      <div className={s.noteWrap}>
                        <span className={s.detailLabel}>メモ</span>
                        <p className={s.note}>{x.note}</p>
                      </div>
                    )}
                    <div className={s.btnGroup}>
                      <button onClick={() => setEditId(x.id)} className={s.editBtn}>✏️ 編集</button>
                      {delCfm === x.id ? (
                        <>
                          <button onClick={() => { delLog(x.id); setDelCfm(null); }}
                            disabled={busy.delLog}
                            className={`${s.cfmBtn} ${busy.delLog ? s.delBtnDisabled : ""}`}>
                            確定
                          </button>
                          <button onClick={() => setDelCfm(null)} className={s.cfmCancel}>戻る</button>
                        </>
                      ) : (
                        <button onClick={() => setDelCfm(x.id)} className={s.delBtn}>削除</button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
