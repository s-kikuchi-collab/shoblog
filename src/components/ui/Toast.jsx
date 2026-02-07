import s from "./Toast.module.css";

const TYPE_CLASS = { success: "success", error: "error", info: "info" };

function Toast({ type, message }) {
  return (
    <div className={`${s.toast} ${s[TYPE_CLASS[type]] || s.info}`}>
      {message}
    </div>
  );
}

export default function ToastContainer({ toasts }) {
  if (!toasts.length) return null;
  return (
    <div className={s.container}>
      {toasts.map((t) => (
        <Toast key={t.id} type={t.type} message={t.message} />
      ))}
    </div>
  );
}
