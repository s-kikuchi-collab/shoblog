import LogEntryForm from "./ui/LogEntryForm";
import s from "./AddLogPage.module.css";

export default function AddLogPage({ db, addLog, busy }) {
  return (
    <div className={s.page}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h2 className={s.title}>新しい記録</h2>
      </div>
      <div className={s.form}>
        <LogEntryForm
          db={db}
          onSave={(data) => addLog(data)}
          busy={busy.addLog}
        />
      </div>
    </div>
  );
}
