import { GENRES, getGenreStyle } from "../lib/constants";
import { Ch } from "./ui/Chip";
import Spinner from "./ui/Spinner";
import shared from "../styles/shared.module.css";
import s from "./AddLogPage.module.css";

export default function AddLogPage({ nl, setNl, db, addLog, busy }) {
  const canSave = nl.name && nl.date && !busy.addLog;
  return (
    <div className={s.page}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h2 className={s.title}>新しい記録</h2>
      </div>
      <div className={s.form}>
        <div className={s.chipRow}>
          <Ch label="既存の店" active={!nl.isNew} onClick={() => setNl((x) => ({ ...x, isNew: false }))} />
          <Ch
            label="新しい店"
            active={nl.isNew}
            onClick={() => setNl((x) => ({ ...x, isNew: true, name: "" }))}
          />
        </div>
        {!nl.isNew ? (
          <div className={s.fieldGroup}>
            <label className={s.label}>店名を選択</label>
            <select
              value={nl.name}
              onChange={(e) => {
                const r = db.find((x) => x.n === e.target.value);
                if (r) setNl((x) => ({ ...x, name: r.n, area: r.a, genre: r.g }));
              }}
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
          <div className={s.newFieldGrid}>
            <div>
              <label className={s.label}>店名</label>
              <input
                type="text"
                value={nl.name}
                onChange={(e) => setNl((x) => ({ ...x, name: e.target.value }))}
                placeholder="新しい店名"
                className={shared.input}
              />
            </div>
            <div className={s.twoCol}>
              <div>
                <label className={s.label}>エリア</label>
                <input
                  type="text"
                  value={nl.area}
                  onChange={(e) => setNl((x) => ({ ...x, area: e.target.value }))}
                  placeholder="六本木"
                  className={shared.input}
                />
              </div>
              <div>
                <label className={s.label}>ジャンル（複数選択可）</label>
                <div className={s.genreWrap}>
                  {GENRES.filter((g) => g !== "すべて").map((g) => {
                    const gs = getGenreStyle(g);
                    return (
                      <Ch
                        key={g}
                        label={g}
                        active={(nl.genre || "").split("/").includes(g)}
                        onClick={() => {
                          const arr = (nl.genre || "").split("/").filter(Boolean);
                          setNl((x) => ({
                            ...x,
                            genre: arr.includes(g)
                              ? arr.filter((z) => z !== g).join("/")
                              : [...arr, g].join("/"),
                          }));
                        }}
                        icon={gs.icon}
                        color={gs.color}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
        <div style={{ marginBottom: 14 }}>
          <label className={s.label}>訪問日</label>
          <input
            type="date"
            value={nl.date}
            onChange={(e) => setNl((x) => ({ ...x, date: e.target.value }))}
            className={shared.input}
          />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label className={s.label}>評価</label>
          <div className={s.ratingRow}>
            {[1, 2, 3, 4, 5].map((i) => (
              <button
                key={i}
                onClick={() => setNl((x) => ({ ...x, rating: i }))}
                className={`${s.starBtn} ${i <= nl.rating ? "" : s.starDim}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        <div className={s.memoField}>
          <label className={s.label}>メモ</label>
          <textarea
            value={nl.note}
            onChange={(e) => setNl((x) => ({ ...x, note: e.target.value }))}
            placeholder="感想..."
            rows={3}
            className={`${shared.input} ${s.textareaResize}`}
          />
        </div>
        <button
          onClick={addLog}
          disabled={!canSave}
          className={`${s.submitBtn} ${canSave ? "" : s.submitDisabled}`}
        >
          {busy.addLog && <Spinner size="sm" />}
          {busy.addLog ? "保存中..." : "記録を保存"}
        </button>
      </div>
    </div>
  );
}
