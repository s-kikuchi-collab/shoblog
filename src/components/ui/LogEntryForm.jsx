import { useState } from "react";
import { GENRES, getGenreStyle } from "../../lib/constants";
import { Ch } from "./Chip";
import shared from "../../styles/shared.module.css";
import s from "./LogEntryForm.module.css";

export default function LogEntryForm({ defaultShop, defaultDate, defaultWho, onSave, onCancel, db, busy }) {
  const [isNew, setIsNew] = useState(!defaultShop);
  const [name, setName] = useState(defaultShop || "");
  const [area, setArea] = useState("");
  const [genre, setGenre] = useState("");
  const [date, setDate] = useState(defaultDate || new Date().toISOString().slice(0, 10));
  const [rating, setRating] = useState(5);
  const [memo, setMemo] = useState("");
  const [who, setWho] = useState(defaultWho || "shobu");

  // When selecting an existing restaurant, fill area/genre
  const handleSelectExisting = (val) => {
    const r = db.find((x) => x.n === val);
    if (r) {
      setName(r.n);
      setArea(r.a);
      setGenre(r.g);
    }
  };

  const canSave = name && date && !busy;

  const handleSave = () => {
    if (!canSave) return;
    onSave({ name, area, genre, date, rating, memo, who, isNew });
  };

  return (
    <div className={s.form}>
      {!defaultShop && (
        <div className={s.chipRow}>
          <Ch label="既存の店" active={!isNew} onClick={() => setIsNew(false)} />
          <Ch label="新しい店" active={isNew} onClick={() => { setIsNew(true); setName(""); }} />
        </div>
      )}

      {defaultShop ? (
        <div className={s.shopFixed}>
          <span className={s.shopLabel}>お店</span>
          <strong className={s.shopName}>{defaultShop}</strong>
        </div>
      ) : !isNew ? (
        <div className={s.field}>
          <label className={s.label}>店名を選択</label>
          <select
            value={name}
            onChange={(e) => handleSelectExisting(e.target.value)}
            className={shared.input}
          >
            <option value="">選択してください</option>
            {[...db]
              .sort((a, b) => b.v - a.v)
              .map((r) => (
                <option key={r.id} value={r.n}>
                  {r.n + "（" + r.a + " / " + r.v + "回）"}
                </option>
              ))}
          </select>
        </div>
      ) : (
        <div className={s.newFields}>
          <div className={s.field}>
            <label className={s.label}>店名</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="新しい店名" className={shared.input} />
          </div>
          <div className={s.twoCol}>
            <div className={s.field}>
              <label className={s.label}>エリア</label>
              <input type="text" value={area} onChange={(e) => setArea(e.target.value)}
                placeholder="六本木" className={shared.input} />
            </div>
            <div className={s.field}>
              <label className={s.label}>ジャンル</label>
              <div className={s.genreWrap}>
                {GENRES.filter((g) => g !== "すべて").map((g) => {
                  const gs = getGenreStyle(g);
                  return (
                    <Ch key={g} label={g}
                      active={(genre || "").split("/").includes(g)}
                      onClick={() => {
                        const arr = (genre || "").split("/").filter(Boolean);
                        setGenre(arr.includes(g) ? arr.filter((z) => z !== g).join("/") : [...arr, g].join("/"));
                      }}
                      icon={gs.icon} color={gs.color} />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={s.row}>
        <div className={s.field}>
          <label className={s.label}>訪問日</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={shared.input} />
        </div>
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
      </div>

      <div className={s.field}>
        <label className={s.label}>メモ</label>
        <textarea value={memo} onChange={(e) => setMemo(e.target.value)}
          placeholder="感想..." rows={3}
          className={`${shared.input} ${s.textareaResize}`} />
      </div>

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
