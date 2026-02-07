import { GENRES, AREAS, ATMS, getGenreStyle } from "../lib/constants";
import Crd from "./ui/Card";
import { Ch, Chs } from "./ui/Chip";
import s from "./HomePage.module.css";

export default function HomePage({ pf, setPf, doSearch, TOT }) {
  return (
    <div className={s.page}>
      <div className={s.titleWrap}>
        <h1 className={s.title}>今宵の一軒</h1>
        <p className={s.subtitle}>全{TOT}店からお好みで検索</p>
      </div>
      <div className={s.grid}>
        <Crd title="料理ジャンル 🍽">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            <Ch label="すべて" active={pf.genre === "すべて"} onClick={() => setPf((p) => ({ ...p, genre: "すべて" }))} />
            {GENRES.filter((g) => g !== "すべて").map((g) => {
              const gs = getGenreStyle(g);
              return (
                <Ch
                  key={g}
                  label={g}
                  active={pf.genre === g}
                  onClick={() => setPf((p) => ({ ...p, genre: g }))}
                  icon={gs.icon}
                  color={gs.color}
                />
              );
            })}
          </div>
        </Crd>
        <Crd title="エリア 📍">
          <Chs items={AREAS} val={pf.area} set={(v) => setPf((p) => ({ ...p, area: v }))} />
        </Crd>
        <Crd title="店内要素 🚪">
          <Chs
            items={[
              ["any", "指定なし"],
              ["yes", "個室あり"],
              ["semi", "半個室あり"],
              ["group8", "8人同席対応可能"],
              ["no", "カウンター"],
            ]}
            val={pf.priv}
            set={(v) => setPf((p) => ({ ...p, priv: v }))}
            kv={true}
          />
        </Crd>
        <Crd title="雰囲気 ✨">
          <Chs items={ATMS} val={pf.atmo} set={(v) => setPf((p) => ({ ...p, atmo: v }))} />
        </Crd>
        <Crd title="利用シーン 🎯">
          <Chs
            items={[
              ["casual", "カジュアル"],
              ["entertainment", "接待・会食"],
              ["date", "デート"],
              ["celebration", "記念日"],
              ["solo", "1人向け"],
              ["cospa", "コスパ向け"],
              ["luxury", "高級"],
              ["lastsupper", "最後の晩餐"],
            ]}
            val={pf.purp}
            set={(v) => setPf((p) => ({ ...p, purp: v }))}
            kv={true}
          />
        </Crd>
        <Crd title="営業時間 🕰️">
          <Chs
            items={[
              ["any", "指定なし"],
              ["22時以降可能", "22時以降可能"],
              ["24時以降可能", "24時以降可能"],
              ["日曜営業", "日曜営業"],
            ]}
            val={pf.hours}
            set={(v) => setPf((p) => ({ ...p, hours: v }))}
            kv={true}
          />
        </Crd>
      </div>
      <div style={{ textAlign: "center", marginTop: 32 }}>
        <button onClick={doSearch} className={s.searchBtn}>
          おすすめを見る
        </button>
      </div>
    </div>
  );
}
