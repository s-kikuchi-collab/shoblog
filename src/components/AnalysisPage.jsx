import Crd from "./ui/Card";
import Br from "./ui/Bar";
import St from "./ui/Stat";
import s from "./AnalysisPage.module.css";

export default function AnalysisPage({ an, TOT, logs, db }) {
  return (
    <div className={s.page}>
      <div className={s.titleWrap}>
        <h2 className={s.title}>あなたの傾向</h2>
        <p className={s.subtitle}>
          全{TOT}店舗・{an.tv}回の訪問データ
        </p>
      </div>
      <div className={s.grid}>
        <Crd title="ジャンル別">
          {an.tg.map(([g, c], i) => (
            <Br key={g} label={g} val={c} max={an.tg[0][1]} top={i === 0} />
          ))}
        </Crd>
        <Crd title="エリア別">
          {an.ta.map(([a, c], i) => (
            <Br key={a} label={a} val={c} max={an.ta[0][1]} top={i === 0} />
          ))}
        </Crd>
        <Crd title="統計">
          <div className={s.statGrid}>
            <St label="総店舗数" val={TOT} />
            <St label="総訪問回数" val={an.tv} />
            <St label="個室率" val={an.pr + "%"} />
            <St label="ユーザーログ" val={logs.length} />
          </div>
        </Crd>
        <Crd title="インサイト">
          <div className={s.insight}>
            <p className={s.insightLine}>
              🔥 最頻店:{" "}
              <b className={s.insightHighlight}>
                {db.length ? [...db].sort((a, b) => b.v - a.v)[0].n : "--"}
              </b>
            </p>
            <p className={s.insightLine}>🚪 個室率: {an.pr}%</p>
            <p className={s.insightLine}>🌏 遠征: 京都・大阪・北海道・金沢ほか</p>
          </div>
        </Crd>
      </div>
    </div>
  );
}
