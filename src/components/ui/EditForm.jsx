import { useState } from "react";
import {
  GENRES, AREA_GROUPS, ATMS, ATMOSPHERE_STYLES, PRS, HOURS,
  PURPOSE_OPTIONS, SPECIALTY_OPTIONS, getGenreStyle,
} from "../../lib/constants";
import { Ch } from "./Chip";
import Fd from "./Field";
import s from "./EditForm.module.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

export default function EditForm({ edit, setEdit, saveEdit, onClose, busy, compact }) {
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const r = await fetch(API_BASE + "/api/images/upload", {
        method: "POST",
        body: formData,
      });
      const d = await r.json();
      if (d.url) setEdit((prev) => ({ ...prev, img: d.url }));
    } catch (err) {
      console.error("Upload failed:", err);
    }
    setUploading(false);
  };
  const toggleSlash = (field, val) => {
    setEdit((e) => {
      const arr = (e[field] || "").split("/").filter(Boolean);
      return {
        ...e,
        [field]: arr.includes(val)
          ? arr.filter((x) => x !== val).join("/")
          : [...arr, val].join("/"),
      };
    });
  };

  const toggleSpace = (field, val) => {
    setEdit((e) => {
      const cur = e[field] || "";
      return {
        ...e,
        [field]: cur.includes(val)
          ? cur.split(" ").filter((x) => x !== val).join(" ")
          : (cur ? cur + " " : "") + val,
      };
    });
  };

  const toggleArr = (field, val) => {
    setEdit((e) => {
      const arr = e[field] || [];
      return {
        ...e,
        [field]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val],
      };
    });
  };

  return (
    <div className={compact ? s.compact : s.form}>
      {!compact && (
        <div className={s.header}>
          <h3 className={s.title}>{edit._new ? "新規店舗追加" : "店舗情報を編集"}</h3>
          <button onClick={onClose} className={s.closeBtn}>✕</button>
        </div>
      )}

      <Fd label="店名 *" val={edit.n} set={(v) => setEdit((e) => ({ ...e, n: v }))} ph="店名を入力" />
      <Fd label="読みがな" val={edit.nk || ""} set={(v) => setEdit((e) => ({ ...e, nk: v }))} ph="ひらがなで入力" />

      <div className={s.sec}>
        <label className={s.secLabel}>📍 エリア（複数選択可）</label>
        <div className={s.areaWrap}>
          {AREA_GROUPS.map((grp) => (
            <div key={grp.label} className={s.areaGrp}>
              <span className={s.areaGrpName} style={{ color: grp.color }}>{grp.label}</span>
              <div className={s.chips}>
                {grp.areas.map((a) => {
                  const name = typeof a === "string" ? a : a.name;
                  return (
                    <Ch key={name} label={name} color={grp.color}
                      active={(edit.a || "").split("/").includes(name)}
                      onClick={() => toggleSlash("a", name)} />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={s.sec}>
        <label className={s.secLabel}>🍽 ジャンル（複数選択可）</label>
        <div className={s.chips}>
          {GENRES.filter((g) => g !== "すべて").map((g) => {
            const gs = getGenreStyle(g);
            return (
              <Ch key={g} label={g} icon={gs.icon} color={gs.color}
                active={(edit.g || "").split("/").includes(g)}
                onClick={() => toggleSlash("g", g)} />
            );
          })}
        </div>
      </div>

      <Fd label="特徴・説明" val={edit.f} set={(v) => setEdit((e) => ({ ...e, f: v }))} ph="お店の特徴" />

      <div className={s.sec}>
        <label className={s.secLabel}>✨ 雰囲気（複数選択可）</label>
        <div className={s.chips}>
          {ATMS.filter((a) => a !== "すべて").map((a) => (
            <Ch key={a} label={a} color={ATMOSPHERE_STYLES[a]}
              active={(edit.m || "").split(" ").includes(a)}
              onClick={() => toggleSpace("m", a)} />
          ))}
        </div>
      </div>

      <div className={s.sec}>
        <label className={s.secLabel}>💴 価格帯</label>
        <div className={s.chips}>
          {PRS.map((p) => (
            <Ch key={p} label={p} active={edit.pr === p}
              onClick={() => setEdit((e) => ({ ...e, pr: p }))} />
          ))}
        </div>
      </div>

      <div className={s.sec}>
        <label className={s.secLabel}>🚪 店内要素</label>
        <div className={s.chips}>
          <Ch label="🚪 個室" active={edit.p}
            onClick={() => setEdit((e) => ({ ...e, p: !e.p }))} />
          <Ch label="🪟 半個室" active={edit.semi}
            onClick={() => setEdit((e) => ({ ...e, semi: !e.semi }))} />
          <Ch label="👥 8人可" active={edit.g8}
            onClick={() => setEdit((e) => ({ ...e, g8: !e.g8 }))} />
          <Ch label="🍽️ テーブル" active={edit.tbl}
            onClick={() => setEdit((e) => ({ ...e, tbl: !e.tbl }))} />
          <Ch label="🪑 カウンター" active={edit.cnt}
            onClick={() => setEdit((e) => ({ ...e, cnt: !e.cnt }))} />
          <Ch label="🌿 テラス" active={edit.terrace}
            onClick={() => setEdit((e) => ({ ...e, terrace: !e.terrace }))} />
        </div>
      </div>

      <div className={s.sec}>
        <label className={s.secLabel}>🕰️ 営業時間</label>
        <div className={s.chips}>
          {HOURS.map((h) => (
            <Ch key={h} label={h} active={(edit.l || "").includes(h)}
              onClick={() => toggleSpace("l", h)} />
          ))}
        </div>
      </div>

      <div className={s.sec}>
        <label className={s.secLabel}>🎯 利用シーン（複数選択可）</label>
        <div className={s.chips}>
          {PURPOSE_OPTIONS.filter((o) => o.value !== "any").map((opt) => (
            <Ch key={opt.value} label={opt.label} icon={opt.icon} color={opt.color}
              active={(edit.purp || []).includes(opt.value)}
              onClick={() => toggleArr("purp", opt.value)} />
          ))}
        </div>
      </div>

      <div className={s.sec}>
        <label className={s.secLabel}>🏷️ 特性（複数選択可）</label>
        <div className={s.chips}>
          {SPECIALTY_OPTIONS.map((opt) => (
            <Ch key={opt.label} label={opt.label} icon={opt.icon} color={opt.color}
              active={(edit.spec || []).includes(opt.label)}
              onClick={() => toggleArr("spec", opt.label)} />
          ))}
        </div>
      </div>

      <Fd label="訪問回数" val={edit.v} set={(v) => setEdit((e) => ({ ...e, v: v }))} type="number" />

      <div className={s.sec}>
        <label className={s.secLabel}>📷 画像</label>
        {edit.img && (
          <div className={s.imgPreview}>
            <img src={edit.img} alt="" className={s.imgThumb} />
            <button onClick={() => setEdit((e) => ({ ...e, img: "" }))} className={s.imgClear}>✕</button>
          </div>
        )}
        <label className={s.uploadBtn}>
          {uploading ? "アップロード中..." : "画像を選択"}
          <input type="file" accept="image/*" onChange={handleImageUpload} hidden disabled={uploading} />
        </label>
      </div>

      <Fd label="外部リンク（食べログ等）" val={edit.url || ""} set={(v) => setEdit((e) => ({ ...e, url: v }))} ph="https://tabelog.com/..." />

      <div className={s.actions}>
        <button
          onClick={saveEdit}
          disabled={!edit.n || busy}
          className={`${s.saveBtn} ${!edit.n || busy ? s.saveBtnOff : ""}`}
        >
          {busy ? "保存中..." : edit._new ? "追加する" : "保存する"}
        </button>
        {compact && (
          <button onClick={onClose} className={s.cancelBtn}>キャンセル</button>
        )}
      </div>
    </div>
  );
}
