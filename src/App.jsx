import { useState, useEffect } from "react";
import { sb } from "./lib/supabase";
import LoginPage from "./components/LoginPage";
import AppMain from "./AppMain";
import Spinner from "./components/ui/Spinner";
import s from "./App.module.css";

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sb.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setLoading(false);
    });
    const {
      data: { subscription },
    } = sb.auth.onAuthStateChange((_, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  if (loading)
    return (
      <div className={s.loading}>
        <Spinner size="lg" />
      </div>
    );
  if (!session) return <LoginPage />;
  return <AppMain onLogout={() => sb.auth.signOut()} />;
}
