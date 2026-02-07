import { Ch } from "./ui/Chip";
import Tg from "./ui/Tag";
import Spinner from "./ui/Spinner";
import shared from "../styles/shared.module.css";
import s from "./ReservationsPage.module.css";

const RESV_ST = {
  pending: { label: "確認中", cls: "statusPending" },
  confirmed: { label: "確定", cls: "statusConfirmed" },
  cancelled: { label: "キャンセル", cls: "statusCancelled" },
};

export default function ReservationsPage({
  resv, resvF, setResvF, resvS, setResvS, resvLoading, fetchResv, updateResv, busy,
}) {
  return (
    <div className={s.page}>
      <div className={s.titleWrap}>
        <h2 className={s.title}>LINE予約管理</h2>
        <p className={s.subtitle}>LINEから受信した予約を管理</p>
      </div>
      <div className={s.toolbar}>
        <input
          type="text"
          placeholder="店名・送信者で検索..."
          value={resvF}
          onChange={(e) => setResvF(e.target.value)}
          className={`${shared.input} ${s.searchInput}`}
        />
        <Ch
          label="すべて"
          active={resvS === "all"}
          onClick={() => { setResvS("all"); fetchResv("all", resvF); }}
        />
        <Ch
          label="確認中"
          active={resvS === "pending"}
          onClick={() => { setResvS("pending"); fetchResv("pending", resvF); }}
        />
        <Ch
          label="確定"
          active={resvS === "confirmed"}
          onClick={() => { setResvS("confirmed"); fetchResv("confirmed", resvF); }}
        />
        <Ch
          label="キャンセル"
          active={resvS === "cancelled"}
          onClick={() => { setResvS("cancelled"); fetchResv("cancelled", resvF); }}
        />
        <button onClick={() => fetchResv(resvS, resvF)} className={shared.link} style={{ whiteSpace: "nowrap" }}>
          更新
        </button>
      </div>
      {resvLoading ? (
        <div className={s.loadingWrap}><Spinner size="lg" label="読み込み中..." /></div>
      ) : resv.length === 0 ? (
        <div className={s.emptyWrap}>
          <p className={s.emptyIcon}>📱</p>
          <p>予約データがありません</p>
          <p className={s.emptyHint}>LINEからメッセージを送信すると、ここに表示されます</p>
        </div>
      ) : (
        <div className={s.grid}>
          {resv.map((rv) => {
            const st = RESV_ST[rv.status] || RESV_ST.pending;
            return (
              <div key={rv.id} className={s.resvCard}>
                <div className={s.resvHeader}>
                  <div>
                    <div className={s.resvNameRow}>
                      <strong className={s.resvName}>{rv.restaurant_name}</strong>
                      <span className={`${s.statusBadge} ${s[st.cls]}`}>
                        {st.label}
                      </span>
                    </div>
                    <div className={s.tagRow}>
                      <Tg t={"📅 " + rv.date} />
                      <Tg t={"🕐 " + rv.time} />
                      {rv.party_size && <Tg t={"👥 " + rv.party_size + "名"} gold />}
                      <Tg t={rv.line_display_name} />
                    </div>
                  </div>
                  <div className={s.actionGroup}>
                    {rv.status !== "confirmed" && (
                      <button
                        onClick={() => updateResv(rv.id, "confirmed")}
                        disabled={busy.updateResv}
                        className={`${s.confirmActionBtn} ${busy.updateResv ? s.actionBtnBusy : ""}`}
                      >
                        確定
                      </button>
                    )}
                    {rv.status !== "cancelled" && (
                      <button
                        onClick={() => updateResv(rv.id, "cancelled")}
                        disabled={busy.updateResv}
                        className={`${s.cancelActionBtn} ${busy.updateResv ? s.actionBtnBusy : ""}`}
                      >
                        取消
                      </button>
                    )}
                  </div>
                </div>
                {rv.raw_message && (
                  <div className={s.rawMessage}>
                    💬 {rv.raw_message}
                  </div>
                )}
                <div className={s.timestamp}>
                  {new Date(rv.created_at).toLocaleString("ja-JP")}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
