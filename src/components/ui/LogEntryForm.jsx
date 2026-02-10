import { useState, useMemo, useRef, useEffect } from "react";
import { PRICE_PER_PERSON } from "../../lib/constants";
import { toHiragana } from "../../data/kana-map";
import { Ch } from "./Chip";
import shared from "../../styles/shared.module.css";
import s from "./LogEntryForm.module.css";

const PURPOSES = [
  { value: "接待", icon: "🤝" },
  { value: "デート", icon: "💕" },
  { value: "記念日", icon: "🎂" },
  { value: "1人", icon: "🧘" },
  { value: "友人", icon: "👫" },
  { value: "家族", icon: "👨‍👩‍👧" },
  { value: "仕事仲間", icon: "💼" },
  { value: "パーティー", icon: "🎉" },
];

export default function LogEntryForm({
  defaultShop, defaultDate, defaultWho, defaultPurpose, defaultPeople,
  defaultRating, defaultMemo, defaultPricePerPerson,
  onSave, onCancel, db, busy,
}) {
  const [name, setName] = useState(defaultShop || "");
  const [shopQuery, setShopQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [date, setDate] = useState(defaultDate || new Date().toISOString().slice(0, 10));
  const [rating, setRating] = useState(defaultRating || 5);
  const [memo, setMemo] = useState(defaultMemo || "");
  const [who, setWho] = useState(defaultWho || "shobu");
  const [purpose, setPurpose] = useState(defaultPurpose || "");
  const [people, setPeople] = useState(defaultPeople || 2);
  const [pricePerPerson, setPricePerPerson] = useState(defaultPricePerPerson || "");
  const dropRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = useMemo(() => {
    if (!shopQuery) return [];
    const q = toHiragana(shopQuery);
    return db
      .filter((r) => r.n.includes(shopQuery) || (r.nk && r.nk.includes(q)))
      .sort((a, b) => b.v - a.v)
      .slice(0, 10);
  }, [shopQuery, db]);

  const handleSelectShop = (r) => {
    setName(r.n);
    setShopQuery("");
    setShowDropdown(false);
  };

  const clearShop = () => {
    setName("");
    setShopQuery("");
  };

  const canSave = name && date && !busy;

  const handleSave = () => {
    if (!canSave) return;
    onSave({ name, date, rating, memo, who, purpose, people, price_per_person: pricePerPerson });
  };

  return (
    <div className={s.form}>
      {/* 店名選択 */}
      {defaultShop ? (
        <div className={s.shopFixed}>
          <span className={s.shopLabel}>お店</span>
          <strong className={s.shopName}>{defaultShop}</strong>
        </div>
      ) : name ? (
        <div className={s.shopSelected}>
          <span className={s.shopLabel}>お店</span>
          <strong className={s.shopName}>{name}</strong>
          <button onClick={clearShop} className={s.clearBtn}>✕</button>
        </div>
      ) : (
        <div className={s.field} ref={dropRef}>
          <label className={s.label}>店名を検索</label>
          <input
            type="text"
            value={shopQuery}
            onChange={(e) => { setShopQuery(e.target.value); setShowDropdown(true); }}
            onFocus={() => setShowDropdown(true)}
            placeholder="店名を入力..."
            className={shared.input}
          />
          {showDropdown && filtered.length > 0 && (
            <div className={s.dropdown}>
              {filtered.map((r) => (
                <button key={r.id} className={s.dropItem} onClick={() => handleSelectShop(r)}>
                  <span>{r.n}</span>
                  <span className={s.dropMeta}>{r.a} / {r.v}回</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 用途 */}
      <div className={s.field}>
        <label className={s.label}>用途</label>
        <div className={s.chips}>
          {PURPOSES.map((p) => (
            <Ch key={p.value} label={`${p.icon} ${p.value}`} active={purpose === p.value}
              onClick={() => setPurpose(purpose === p.value ? "" : p.value)} />
          ))}
        </div>
      </div>

      {/* 日付・人数 */}
      <div className={s.twoCol}>
        <div className={s.field}>
          <label className={s.label}>訪問日</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={shared.input} />
        </div>
        <div className={s.field}>
          <label className={s.label}>人数</label>
          <input type="number" value={people} min={1} max={20}
            onChange={(e) => setPeople(Number(e.target.value))} className={shared.input} />
        </div>
      </div>

      {/* 評価 */}
      <div className={s.field}>
        <label className={s.label}>評価</label>
        <div className={s.ratingRow}>
          {[1, 2, 3, 4, 5].map((i) => (
            <button key={i} onClick={() => setRating(i)}
              className={`${s.starBtn} ${i <= rating ? "" : s.starDim}`}>
              ★
            </button>
          ))}
        </div>
      </div>

      {/* 1人単価 */}
      <div className={s.field}>
        <label className={s.label}>1人単価</label>
        <div className={s.chips}>
          {PRICE_PER_PERSON.map((p) => (
            <Ch key={p} label={p} active={pricePerPerson === p}
              onClick={() => setPricePerPerson(pricePerPerson === p ? "" : p)} />
          ))}
        </div>
      </div>

      {/* メモ */}
      <div className={s.field}>
        <label className={s.label}>メモ</label>
        <textarea value={memo} onChange={(e) => setMemo(e.target.value)}
          placeholder="感想..." rows={2}
          className={`${shared.input} ${s.textareaResize}`} />
      </div>

      {/* ボタン */}
      <div className={s.actions}>
        <button onClick={handleSave} disabled={!canSave}
          className={`${s.saveBtn} ${canSave ? "" : s.saveBtnOff}`}>
          {busy ? "保存中..." : "記録を保存"}
        </button>
        {onCancel && (
          <button onClick={onCancel} className={s.cancelBtn}>キャンセル</button>
        )}
      </div>
    </div>
  );
}
