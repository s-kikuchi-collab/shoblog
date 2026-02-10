import { useState, useMemo, useRef, useEffect } from "react";
import { toHiragana } from "../data/kana-map";
import KANA_MAP from "../data/kana-map";
import { Ch } from "./ui/Chip";
import Tg from "./ui/Tag";
import shared from "../styles/shared.module.css";
import s from "./ReservationsPage.module.css";

const PURPOSES = [
  { value: "接待", icon: "🤝" },
  { value: "デート", icon: "💕" },
  { value: "記念日", icon: "🎂" },
  { value: "1人", icon: "🧘" },
  { value: "友人", icon: "👫" },
  { value: "家族", icon: "👨‍👩‍👧" },
  { value: "仕事仲間", icon: "💼" },
];

const WHOS = ["shobu", "aco"];

function today() {
  return new Date().toISOString().slice(0, 10);
}

function ShopSuggest({ value, onChange, db }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const suggestions = useMemo(() => {
    if (!value || value.length < 1) return [];
    const q = toHiragana(value);
    return db
      .filter((x) =>
        x.n.includes(value) ||
        (x.nk && x.nk.includes(q)) ||
        (KANA_MAP[x.n] && KANA_MAP[x.n].includes(q))
      )
      .slice(0, 8);
  }, [value, db]);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className={s.suggestWrap} ref={ref}>
      <input
        type="text"
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder="店名を入力..."
        className={shared.input}
      />
      {open && suggestions.length > 0 && (
        <div className={s.suggestDropdown}>
          {suggestions.map((x) => (
            <button
              key={x.id}
              className={s.suggestItem}
              onClick={() => { onChange(x.n); setOpen(false); }}
            >
              <span>{x.n}</span>
              <span className={s.suggestMeta}>{x.a} / {x.g}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ResvForm({ db, onSave, busy, initial, onCancel }) {
  const [shop, setShop] = useState(initial?.shop || "");
  const [date, setDate] = useState(initial?.date || today());
  const [time, setTime] = useState(initial?.time || "19:00");
  const [people, setPeople] = useState(initial?.people || 2);
  const [purpose, setPurpose] = useState(initial?.purpose || "");
  const [who, setWho] = useState(initial?.who || "shobu");

  const handleSave = () => {
    if (!shop || !date) return;
    onSave({ shop, date, time, people, purpose, who });
    if (!initial) {
      setShop(""); setDate(today()); setTime("19:00"); setPeople(2); setPurpose(""); setWho("shobu");
    }
  };

  return (
    <div className={s.form}>
      <div className={s.formField}>
        <label className={s.formLabel}>お店 *</label>
        <ShopSuggest value={shop} onChange={setShop} db={db} />
      </div>
      <div className={s.formRow}>
        <div className={s.formField}>
          <label className={s.formLabel}>日付</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={shared.input} />
        </div>
        <div className={s.formField}>
          <label className={s.formLabel}>時間</label>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={shared.input} />
        </div>
        <div className={s.formField}>
          <label className={s.formLabel}>人数</label>
          <input type="number" value={people} min={1} max={20} onChange={(e) => setPeople(Number(e.target.value))} className={shared.input} />
        </div>
      </div>
      <div className={s.formField}>
        <label className={s.formLabel}>用途</label>
        <div className={s.chips}>
          {PURPOSES.map((p) => (
            <Ch key={p.value} label={`${p.icon} ${p.value}`} active={purpose === p.value}
              onClick={() => setPurpose(purpose === p.value ? "" : p.value)} />
          ))}
        </div>
      </div>
      <div className={s.formField}>
        <label className={s.formLabel}>入力者</label>
        <div className={s.chips}>
          {WHOS.map((w) => (
            <Ch key={w} label={w} active={who === w} onClick={() => setWho(w)} />
          ))}
        </div>
      </div>
      <div className={s.formActions}>
        <button onClick={handleSave} disabled={!shop || busy}
          className={`${s.saveBtn} ${!shop || busy ? s.saveBtnOff : ""}`}>
          {busy ? "保存中..." : initial ? "更新する" : "保存する"}
        </button>
        {onCancel && (
          <button onClick={onCancel} className={s.cancelBtn}>キャンセル</button>
        )}
      </div>
    </div>
  );
}

function Stars({ value, onChange, readonly }) {
  return (
    <div className={s.stars}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} className={`${s.star} ${n <= value ? s.starOn : ""}`}
          onClick={() => !readonly && onChange(n)} disabled={readonly}>
          {n <= value ? "★" : "☆"}
        </button>
      ))}
    </div>
  );
}

function CompleteForm({ onComplete, busy }) {
  const [sat, setSat] = useState(4);
  const [comment, setComment] = useState("");

  return (
    <div className={s.completeForm}>
      <div className={s.formField}>
        <label className={s.formLabel}>満足度</label>
        <Stars value={sat} onChange={setSat} />
      </div>
      <div className={s.formField}>
        <label className={s.formLabel}>コメント</label>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)}
          placeholder="料理の感想、雰囲気、次回のメモなど"
          className={`${shared.input} ${s.textarea}`} rows={3} />
      </div>
      <button onClick={() => onComplete(sat, comment)} disabled={busy}
        className={`${s.completeBtn} ${busy ? s.saveBtnOff : ""}`}>
        {busy ? "処理中..." : "完了する"}
      </button>
    </div>
  );
}

export default function ReservationsPage({ resv, db, busy, addResv, editResv, deleteResv, completeResv }) {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [completeId, setCompleteId] = useState(null);
  const [delCfm, setDelCfm] = useState(null);
  const [showAllCompleted, setShowAllCompleted] = useState(false);

  const upcoming = useMemo(() =>
    resv.filter((r) => r.status === "upcoming")
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)),
    [resv]
  );

  const completed = useMemo(() =>
    resv.filter((r) => r.status === "completed")
      .sort((a, b) => (b.completed_at || "").localeCompare(a.completed_at || "")),
    [resv]
  );

  const isPast = (date) => date < today();

  const handleAdd = async (data) => {
    await addResv(data);
    setShowForm(false);
  };

  const handleEdit = async (data) => {
    await editResv(editId, data);
    setEditId(null);
  };

  const handleComplete = async (sat, comment) => {
    await completeResv(completeId, sat, comment);
    setCompleteId(null);
  };

  const displayCompleted = showAllCompleted ? completed : completed.slice(0, 5);

  return (
    <div className={s.page}>
      <div className={s.titleWrap}>
        <h2 className={s.title}>予定管理</h2>
        <p className={s.subtitle}>予約の追加・完了・記録</p>
      </div>

      {/* 新規予約ボタン / フォーム */}
      {showForm ? (
        <div className={s.section}>
          <div className={s.sectionHeader}>予約を追加</div>
          <ResvForm db={db} onSave={handleAdd} busy={busy.addResv} onCancel={() => setShowForm(false)} />
        </div>
      ) : (
        <button onClick={() => setShowForm(true)} className={s.addBtn}>
          ＋ 予約を追加
        </button>
      )}

      {/* これから */}
      <div className={s.section}>
        <div className={s.sectionHeader}>これから ({upcoming.length})</div>
        {upcoming.length === 0 ? (
          <div className={s.emptyWrap}>
            <p className={s.emptyHint}>予約がありません</p>
          </div>
        ) : (
          <div className={s.grid}>
            {upcoming.map((rv) => (
              <div key={rv.id} className={`${s.card} ${isPast(rv.date) ? s.cardPast : ""}`}>
                {editId === rv.id ? (
                  <ResvForm db={db} onSave={handleEdit} busy={busy.editResv}
                    initial={rv} onCancel={() => setEditId(null)} />
                ) : (
                  <>
                    <div className={s.cardHeader}>
                      <strong className={s.cardName}>{rv.shop}</strong>
                      <div className={s.cardActions}>
                        <button onClick={() => setEditId(rv.id)} className={s.iconBtn}>✏️</button>
                        {delCfm === rv.id ? (
                          <>
                            <button onClick={() => { deleteResv(rv.id); setDelCfm(null); }}
                              className={s.iconBtn} style={{ color: "#c88080" }}>確定</button>
                            <button onClick={() => setDelCfm(null)} className={s.iconBtn}>戻る</button>
                          </>
                        ) : (
                          <button onClick={() => setDelCfm(rv.id)} className={s.iconBtn}>🗑</button>
                        )}
                      </div>
                    </div>
                    <div className={s.cardDateTime}>
                      <span>📅 {rv.date}</span>
                      <span>🕐 {rv.time}</span>
                    </div>
                    <div className={s.tagRow}>
                      <Tg t={"👥 " + rv.people + "名"} gold />
                      {rv.purpose && <Tg t={rv.purpose} />}
                      <Tg t={rv.who} />
                    </div>
                    {isPast(rv.date) && completeId !== rv.id && (
                      <button onClick={() => setCompleteId(rv.id)} className={s.completeBtn}>
                        完了する
                      </button>
                    )}
                    {completeId === rv.id && (
                      <CompleteForm onComplete={handleComplete} busy={busy.completeResv} />
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 完了済み */}
      {completed.length > 0 && (
        <div className={s.section}>
          <div className={s.sectionHeader}>完了済み ({completed.length})</div>
          <div className={s.grid}>
            {displayCompleted.map((rv) => (
              <div key={rv.id} className={s.cardCompleted}>
                <div className={s.cardHeader}>
                  <strong className={s.cardName}>{rv.shop}</strong>
                  <Stars value={rv.satisfaction || 0} readonly />
                </div>
                <div className={s.cardDateTime}>
                  <span>📅 {rv.date}</span>
                </div>
                <div className={s.tagRow}>
                  <Tg t={"👥 " + rv.people + "名"} gold />
                  {rv.purpose && <Tg t={rv.purpose} />}
                  <Tg t={rv.who} />
                </div>
                {rv.comment && <div className={s.commentText}>{rv.comment}</div>}
              </div>
            ))}
          </div>
          {completed.length > 5 && !showAllCompleted && (
            <button onClick={() => setShowAllCompleted(true)} className={s.moreBtn}>
              もっと見る ({completed.length - 5}件)
            </button>
          )}
        </div>
      )}
    </div>
  );
}
