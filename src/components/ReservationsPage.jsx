import { useState, useMemo, useRef, useEffect } from "react";
import { toHiragana } from "../data/kana-map";
import KANA_MAP from "../data/kana-map";
import { Ch } from "./ui/Chip";
import Tg from "./ui/Tag";
import LogEntryForm from "./ui/LogEntryForm";
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

export default function ReservationsPage({ resv, db, busy, addResv, editResv, deleteResv, completeResv, setPg }) {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [completeId, setCompleteId] = useState(null);
  const [delCfm, setDelCfm] = useState(null);

  const upcoming = useMemo(() =>
    resv.filter((r) => r.status === "upcoming")
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)),
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

  const handleComplete = async (logData) => {
    await completeResv(completeId, logData);
    setCompleteId(null);
    if (setPg) setPg("logs");
  };

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
                ) : completeId === rv.id ? (
                  <div>
                    <div className={s.cardHeader}>
                      <strong className={s.cardName}>{rv.shop}</strong>
                    </div>
                    <div className={s.cardDateTime}>
                      <span>📅 {rv.date}</span>
                      <span>🕐 {rv.time}</span>
                    </div>
                    <div className={s.completeFormWrap}>
                      <LogEntryForm
                        defaultShop={rv.shop}
                        defaultDate={rv.date}
                        defaultWho={rv.who}
                        onSave={handleComplete}
                        onCancel={() => setCompleteId(null)}
                        db={db}
                        busy={busy.completeResv}
                      />
                    </div>
                  </div>
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
                    {isPast(rv.date) && (
                      <button onClick={() => setCompleteId(rv.id)}
                        className={`${s.completeBtn} ${s.completeBtnPast}`}>
                        ✅ 済み
                      </button>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
