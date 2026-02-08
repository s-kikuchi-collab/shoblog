import { useState, useEffect, useCallback, useMemo } from "react";
import { AM, RG, RGA } from "./lib/constants";
import { sbGet, sbSet } from "./lib/supabase";
import { INIT_DB } from "./data/seed";
import KANA_MAP, { toHiragana } from "./data/kana-map";
import TABELOG from "./data/tabelog-data.json";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import ResultsPage from "./components/ResultsPage";
import AnalysisPage from "./components/AnalysisPage";
import LogsPage from "./components/LogsPage";
import AddLogPage from "./components/AddLogPage";
import ManagePage from "./components/ManagePage";
import ReservationsPage from "./components/ReservationsPage";
import Spinner from "./components/ui/Spinner";
import ToastContainer from "./components/ui/Toast";
import s from "./AppMain.module.css";

export default function AppMain({ onLogout }) {
  const [pg, setPg] = useState("home");
  const [db, setDb] = useState([]);
  const [pf, setPf] = useState({
    genre: "すべて", area: [], priv: "any", atmo: "すべて", hours: "any",
    purp: "any", price: "any", spec: [],
  });
  const [recs, setRecs] = useState([]);
  const [logs, setLogs] = useState([]);
  const [nl, setNl] = useState({ name: "", area: "", genre: "", date: "", rating: 5, note: "", isNew: false });
  const [sel, setSel] = useState(null);
  const [lf, setLf] = useState("");
  const [mf, setMf] = useState("");
  const [mSel, setMSel] = useState(null);
  const [cnt, setCnt] = useState(20);
  const [edit, setEdit] = useState(null);
  const [cfm, setCfm] = useState(null);
  const [ready, setReady] = useState(false);
  const [resv, setResv] = useState([]);
  const [resvF, setResvF] = useState("");
  const [resvS, setResvS] = useState("all");
  const [resvLoading, setResvLoading] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [busy, setBusy] = useState({});
  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

  const toast = useCallback((type, message) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  }, []);

  const setBusyKey = useCallback((key, val) => {
    setBusy((b) => ({ ...b, [key]: val }));
  }, []);

  useEffect(() => {
    (async () => {
      let d = null;
      try {
        const r = await sbGet("restaurant-db");
        if (r) d = typeof r === "string" ? JSON.parse(r) : r;
      } catch (e) {
        toast("error", "データの読み込みに失敗しました");
      }
      if (!d || !d.length) {
        d = INIT_DB;
        try { await sbSet("restaurant-db", d); } catch (e) {}
      }
      const areaMap = { "西麻布": "麻布", "東麻布": "麻布", "南麻布": "麻布", "有楽町": "日比谷", "丸の内": "日比谷", "荒木町": "四谷" };
      const priceMap = { "中": "5-6千円未満", "中〜高": "1万円ぐらい", "高": "2万円-3万円" };
      const normArea = (a) => (a || "").split("/").map((s) => { const t = s.trim(); return areaMap[t] || t; }).join("/");
      d = d.map((x) => {
        const tb = TABELOG[x.n] || {};
        return {
          ...x,
          a: normArea(x.a),
          l: typeof x.l === "boolean" ? (x.l ? "24時以降可能" : "") : x.l || "",
          pr: priceMap[x.pr] || x.pr,
          img: x.img || tb.img || "",
          url: x.url || tb.url || "",
          pn: x.pn || 0,
          spec: x.spec || [],
          nk: x.nk || KANA_MAP[x.n] || "",
        };
      });
      setDb(d);
      try {
        const r = await sbGet("dining-logs");
        if (r) {
          const lg = typeof r === "string" ? JSON.parse(r) : r;
          setLogs(lg);
        }
      } catch (e) {
        toast("error", "記録の読み込みに失敗しました");
      }
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    if (pg === "reservations") fetchResv();
  }, [pg]);

  const svDb = useCallback(async (d) => {
    setDb(d);
    await sbSet("restaurant-db", d);
  }, []);

  const svLg = useCallback(async (d) => {
    setLogs(d);
    await sbSet("dining-logs", d);
  }, []);

  const fetchResv = useCallback(
    async (st, q) => {
      setResvLoading(true);
      try {
        const s = st || resvS;
        const p = new URLSearchParams();
        if (s !== "all") p.set("status", s);
        if (q) p.set("search", q);
        const r = await fetch(API_BASE + "/api/reservations?" + p.toString());
        const d = await r.json();
        setResv(d.data || []);
      } catch (e) {
        toast("error", "予約の取得に失敗しました");
      }
      setResvLoading(false);
    },
    [resvS, toast]
  );

  const updateResv = useCallback(
    async (id, status) => {
      setBusyKey("updateResv", true);
      try {
        await fetch(API_BASE + "/api/reservations/" + id, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        });
        if (status === "confirmed") {
          const rv = resv.find((x) => x.id === id);
          if (rv) {
            const newLog = {
              id: Date.now(), name: rv.restaurant_name, area: "", genre: "",
              date: rv.date, rating: 4,
              note: "LINE予約（" + rv.line_display_name + "・" + rv.party_size + "名）",
              isNew: false,
            };
            const match = db.find((x) => x.n === rv.restaurant_name);
            if (match) { newLog.area = match.a; newLog.genre = match.g; }
            const ul = [newLog, ...logs];
            await svLg(ul);
            if (match) {
              const nd = db.map((x) => (x.id === match.id ? { ...x, v: x.v + 1 } : x));
              await svDb(nd);
            }
          }
        }
        toast("success", "予約を更新しました");
        fetchResv();
      } catch (e) {
        toast("error", "予約の更新に失敗しました");
      }
      setBusyKey("updateResv", false);
    },
    [fetchResv, resv, db, logs, svLg, svDb, toast, setBusyKey]
  );

  const deleteResv = useCallback(
    async (id) => {
      setBusyKey("deleteResv", true);
      try {
        await fetch(API_BASE + "/api/reservations/" + id, { method: "DELETE" });
        toast("success", "予約を削除しました");
        fetchResv();
      } catch (e) {
        toast("error", "予約の削除に失敗しました");
      }
      setBusyKey("deleteResv", false);
    },
    [fetchResv, toast, setBusyKey]
  );

  const clearResv = useCallback(
    async () => {
      setBusyKey("clearResv", true);
      try {
        await fetch(API_BASE + "/api/reservations", { method: "DELETE" });
        toast("success", "全予約を削除しました");
        fetchResv();
      } catch (e) {
        toast("error", "全削除に失敗しました");
      }
      setBusyKey("clearResv", false);
    },
    [fetchResv, toast, setBusyKey]
  );

  const lb = useMemo(() => {
    const m = {};
    logs.forEach((x) => { m[x.name] = (m[x.name] || 0) + 1; });
    return m;
  }, [logs]);

  const doSearch = useCallback(() => {
    let c = db.slice();
    if (pf.genre !== "すべて") c = c.filter((x) => x.g.split("/").includes(pf.genre));
    if (pf.area.length > 0) {
      c = c.filter((x) =>
        pf.area.some((a) => {
          if (a === "その他（地方）")
            return !AM.some((aa) => x.a.includes(aa)) && !RGA.some((aa) => x.a.includes(aa));
          if (RG[a]) return RG[a].some((ci) => x.a.includes(ci));
          return x.a.includes(a);
        })
      );
    }
    if (pf.priv === "yes") c = c.filter((x) => x.p);
    else if (pf.priv === "no") c = c.filter((x) => !x.p);
    else if (pf.priv === "semi") c = c.filter((x) => x.semi);
    else if (pf.priv === "group8") c = c.filter((x) => x.g8);
    if (pf.hours !== "any") c = c.filter((x) => (x.l || "").includes(pf.hours));
    if (pf.atmo !== "すべて") c = c.filter((x) => x.m.includes(pf.atmo));
    if (pf.price !== "any") {
      c = c.filter((x) => x.pr === pf.price);
    }
    if (pf.spec && pf.spec.length > 0) {
      c = c.filter((x) => pf.spec.every((sp) => (x.spec || []).includes(sp)));
    }
    c = c.map((x) => {
      const b = lb[x.n] || 0;
      let s = (x.v + b) * 10;
      const hi = x.pr === "2万円-3万円" || x.pr === "4万円以上";
      const lo = x.pr === "5-6千円未満" || x.pr === "1万円ぐらい";
      if (pf.purp === "entertainment" && x.p && hi) s += 30;
      if (pf.purp === "any" && lo) s += 20;
      if (pf.purp === "date" && (x.m.includes("落ち着") || x.m.includes("隠れ家") || x.m.includes("シック"))) s += 25;
      if (pf.purp === "celebration" && hi) s += 35;
      if (pf.purp === "solo" && !x.p && x.m.includes("カジュアル")) s += 20;
      if (pf.purp === "cospa" && lo) s += 30;
      if (pf.purp === "luxury" && hi && x.m.includes("高級感")) s += 35;
      if (pf.purp === "lastsupper" && hi && x.m.includes("洗練")) s += 40;
      if (pf.purp === "secret" && x.m.includes("隠れ家")) s += 35;
      const ul = logs.filter((ll) => ll.name === x.n);
      if (ul.length > 0) s += Math.round(ul.reduce((a, ll) => a + (ll.rating || 3), 0) / ul.length * 3);
      return { ...x, score: Math.round(s), tv: x.v + b };
    });
    c.sort((a, b) => b.score - a.score);
    setRecs(c);
    setCnt(20);
    setPg("results");
  }, [pf, lb, logs, db]);

  const addLog = useCallback(async () => {
    if (!nl.name || !nl.date) return;
    setBusyKey("addLog", true);
    try {
      const u = [{ ...nl, id: Date.now() }, ...logs];
      await svLg(u);
      const exist = db.find((x) => x.n === nl.name);
      if (exist) {
        await svDb(db.map((x) => (x.id === exist.id ? { ...x, v: x.v + 1 } : x)));
      } else if (nl.isNew && nl.name) {
        await svDb([
          ...db,
          {
            n: nl.name, a: nl.area || "", f: "", m: "", p: false, semi: false, g8: false,
            v: 1, g: nl.genre || "", pr: "1万円ぐらい", l: "", img: "", url: "",
            pn: 0, spec: [], id: nl.name + "_" + Date.now(),
          },
        ]);
      }
      setNl({ name: "", area: "", genre: "", date: "", rating: 5, note: "", isNew: false });
      toast("success", "記録を保存しました");
      setPg("logs");
    } catch (e) {
      toast("error", "記録の保存に失敗しました");
    }
    setBusyKey("addLog", false);
  }, [nl, logs, db, svLg, svDb, toast, setBusyKey]);

  const delLog = useCallback(async (id) => {
    setBusyKey("delLog", true);
    try {
      await svLg(logs.filter((x) => x.id !== id));
      toast("success", "記録を削除しました");
    } catch (e) {
      toast("error", "記録の削除に失敗しました");
    }
    setBusyKey("delLog", false);
  }, [logs, svLg, toast, setBusyKey]);

  const fLogs = useMemo(
    () => (lf ? logs.filter((x) => [x.name, x.area, x.genre, x.note].some((f) => f && f.includes(lf))) : logs),
    [logs, lf]
  );

  const fDb = useMemo(() => {
    if (!mf) return db;
    const q = toHiragana(mf);
    return db.filter((x) =>
      [x.n, x.a, x.g, x.f].some((f) => f && f.includes(mf)) ||
      (x.nk && x.nk.includes(q))
    );
  }, [db, mf]);

  const saveEdit = useCallback(async () => {
    if (!edit || !edit.n) return;
    setBusyKey("saveEdit", true);
    try {
      let nd;
      if (edit._new) {
        nd = [...db, { ...edit, id: edit.n + "_" + Date.now(), _new: undefined }];
      } else {
        nd = db.map((x) => (x.id === edit.id ? { ...edit } : x));
      }
      await svDb(nd);
      setRecs(prev => prev.map(r =>
        r.id === edit.id ? { ...edit, score: r.score, tv: r.tv } : r
      ));
      setEdit(null);
      toast("success", "店舗情報を保存しました");
    } catch (e) {
      toast("error", "店舗情報の保存に失敗しました");
    }
    setBusyKey("saveEdit", false);
  }, [edit, db, svDb, toast, setBusyKey]);

  const delRest = useCallback(async (id) => {
    setBusyKey("delRest", true);
    try {
      await svDb(db.filter((x) => x.id !== id));
      toast("success", "店舗を削除しました");
    } catch (e) {
      toast("error", "店舗の削除に失敗しました");
    }
    setBusyKey("delRest", false);
  }, [db, svDb, toast, setBusyKey]);

  const resetDb = useCallback(async () => {
    setBusyKey("resetDb", true);
    try {
      await svDb(INIT_DB);
      toast("success", "データを初期化しました");
    } catch (e) {
      toast("error", "初期化に失敗しました");
    }
    setBusyKey("resetDb", false);
  }, [svDb, toast, setBusyKey]);

  const exportDb = useCallback(() => {
    const d = JSON.stringify({ restaurants: db, logs }, null, 2);
    const b = new Blob([d], { type: "application/json" });
    const u = URL.createObjectURL(b);
    const a = document.createElement("a");
    a.href = u;
    a.download = "shoblog_backup_" + new Date().toISOString().slice(0, 10) + ".json";
    a.click();
    URL.revokeObjectURL(u);
  }, [db, logs]);

  const importDb = useCallback(
    async (e) => {
      const f = e.target.files[0];
      if (!f) return;
      setBusyKey("importDb", true);
      try {
        const t = await f.text();
        const d = JSON.parse(t);
        if (d.restaurants && Array.isArray(d.restaurants)) {
          await svDb(d.restaurants);
          if (d.logs && Array.isArray(d.logs)) await svLg(d.logs);
          toast("success", "インポート完了: " + d.restaurants.length + "店舗");
        }
      } catch (er) {
        toast("error", "読み込みエラー");
      }
      setBusyKey("importDb", false);
      e.target.value = "";
    },
    [svDb, svLg, toast, setBusyKey]
  );

  const an = useMemo(() => {
    const gc = {};
    const ac = {};
    db.forEach((x) => {
      x.g.split("/").forEach((gg) => { gc[gg] = (gc[gg] || 0) + x.v; });
      x.a.split("/").forEach((aa) => { ac[aa] = (ac[aa] || 0) + x.v; });
    });
    return {
      tg: Object.entries(gc).sort((a, b) => b[1] - a[1]).slice(0, 8),
      ta: Object.entries(ac).sort((a, b) => b[1] - a[1]).slice(0, 8),
      pr: db.length
        ? Math.round(
            (db.reduce((s, x) => s + (x.p ? x.v : 0), 0) / (db.reduce((s, x) => s + x.v, 0) || 1)) * 100
          )
        : 0,
      tv: db.reduce((s, x) => s + x.v, 0),
    };
  }, [db]);

  if (!ready)
    return (
      <div className={s.loadingScreen}>
        <Spinner size="lg" label="読み込み中..." />
      </div>
    );

  const TOT = db.length;

  return (
    <div className={s.app}>
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <Header pg={pg} setPg={setPg} onLogout={onLogout} setEdit={setEdit} />
      <main className={s.main}>
        {pg === "home" && <HomePage pf={pf} setPf={setPf} doSearch={doSearch} TOT={TOT} />}
        {pg === "results" && (
          <ResultsPage
            pf={pf} recs={recs} cnt={cnt} setCnt={setCnt} setPg={setPg}
            lb={lb} sel={sel} setSel={setSel}
            edit={edit} setEdit={setEdit} saveEdit={saveEdit} busy={busy}
          />
        )}

        {/* 記録タブ: サブナビ */}
        {(pg === "logs" || pg === "add") && (
          <div className={s.subNav}>
            <button className={`${s.subTab} ${pg === "logs" ? s.subTabActive : ""}`} onClick={() => setPg("logs")}>記録一覧</button>
            <button className={`${s.subTab} ${pg === "add" ? s.subTabActive : ""}`} onClick={() => setPg("add")}>＋記録追加</button>
          </div>
        )}
        {pg === "logs" && (
          <LogsPage logs={logs} fLogs={fLogs} lf={lf} setLf={setLf} setPg={setPg} delLog={delLog} busy={busy} db={db} />
        )}
        {pg === "add" && <AddLogPage nl={nl} setNl={setNl} db={db} addLog={addLog} busy={busy} />}

        {/* 予定タブ: 予約 */}
        {pg === "reservations" && (
          <ReservationsPage
            resv={resv} resvF={resvF} setResvF={setResvF} resvS={resvS}
            setResvS={setResvS} resvLoading={resvLoading} fetchResv={fetchResv}
            updateResv={updateResv} deleteResv={deleteResv} clearResv={clearResv} busy={busy}
          />
        )}

        {/* 管理タブ: サブナビ */}
        {(pg === "manage" || pg === "analysis") && (
          <div className={s.subNav}>
            <button className={`${s.subTab} ${pg === "manage" ? s.subTabActive : ""}`} onClick={() => setPg("manage")}>店舗管理</button>
            <button className={`${s.subTab} ${pg === "analysis" ? s.subTabActive : ""}`} onClick={() => setPg("analysis")}>分析</button>
          </div>
        )}
        {pg === "manage" && (
          <ManagePage
            db={db} fDb={fDb} mf={mf} setMf={setMf} edit={edit} setEdit={setEdit}
            saveEdit={saveEdit} delRest={delRest} resetDb={resetDb} cfm={cfm} setCfm={setCfm}
            mSel={mSel} setMSel={setMSel} logs={logs} delLog={delLog}
            exportDb={exportDb} importDb={importDb} TOT={TOT} busy={busy}
          />
        )}
        {pg === "analysis" && <AnalysisPage an={an} TOT={TOT} logs={logs} db={db} />}
      </main>
      <ToastContainer toasts={toasts} />
    </div>
  );
}
