import { useState, useMemo } from "react";
import { getGenreStyle } from "../lib/constants";
import Tg from "./ui/Tag";
import RestThumb from "./ui/RestThumb";
import LogEntryForm from "./ui/LogEntryForm";
import shared from "../styles/shared.module.css";
import s from "./LogsPage.module.css";

export default function LogsPage({ logs, fLogs, lf, setLf, setPg, delLog, updateLog, busy, db }) {
  const [editId, setEditId] = useState(null);

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
            return (
              <div key={x.id} className={s.logItem}>
                <RestThumb img={rest?.img} genre={x.genre || rest?.g} />
                <div className={s.logContent}>
                  <div className={s.logNameRow}>
                    {rest?.url ? (
                      <span
                        className={`${s.logName} ${s.logNameLink}`}
                        onClick={() => window.open(rest.url, "_blank", "noopener,noreferrer")}
                      >
                        {x.name}<span className={s.extIcon}>↗</span>
                      </span>
                    ) : (
                      <span className={s.logName}>{x.name}</span>
                    )}
                  </div>
                  <div className={s.tagRow}>
                    <Tg t={x.date} />
                    {x.area && <Tg t={x.area} />}
                    {x.genre &&
                      x.genre.split("/").map((gg) => {
                        const gs = getGenreStyle(gg);
                        return <Tg key={gg} t={gg} icon={gs.icon} color={gs.color} />;
                      })}
                    <Tg t={"★".repeat(x.rating)} gold />
                    {x.purpose && <Tg t={x.purpose} />}
                    {x.people && <Tg t={x.people + "名"} />}
                    {x.price_per_person && <Tg t={x.price_per_person} />}
                  </div>
                  {x.note && <p className={s.note}>{x.note}</p>}
                </div>
                <div className={s.btnGroup}>
                  <button onClick={() => setEditId(x.id)} className={s.editBtn}>✏️</button>
                  <button
                    onClick={() => delLog(x.id)}
                    disabled={busy.delLog}
                    className={`${s.delBtn} ${busy.delLog ? s.delBtnDisabled : ""}`}
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
