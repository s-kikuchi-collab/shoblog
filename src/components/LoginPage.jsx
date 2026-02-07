import { useState } from "react";
import { sb } from "../lib/supabase";
import shared from "../styles/shared.module.css";
import s from "./LoginPage.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const doLogin = async () => {
    setErr("");
    setLoading(true);
    const { error } = await sb.auth.signInWithPassword({ email, password: pw });
    if (error)
      setErr(
        error.message === "Invalid login credentials"
          ? "メールまたはパスワードが違います"
          : error.message
      );
    setLoading(false);
  };

  return (
    <div className={s.page}>
      <div className={s.card}>
        <div className={s.icon}>翔豊</div>
        <div className={s.title}>SHOBLOG</div>
        <div className={s.subtitle}>Dining Concierge</div>
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setErr(""); }}
          placeholder="メールアドレス"
          className={`${shared.input} ${s.inputCenter}`}
        />
        <input
          type="password"
          value={pw}
          onChange={(e) => { setPw(e.target.value); setErr(""); }}
          onKeyDown={(e) => { if (e.key === "Enter") doLogin(); }}
          placeholder="パスワード"
          className={`${shared.input} ${s.inputCenterLast}`}
        />
        {err && <p className={s.error}>{err}</p>}
        <button
          onClick={doLogin}
          disabled={loading}
          className={`${s.btn} ${loading ? s.btnLoading : ""}`}
        >
          {loading ? "ログイン中..." : "ログイン"}
        </button>
      </div>
    </div>
  );
}
