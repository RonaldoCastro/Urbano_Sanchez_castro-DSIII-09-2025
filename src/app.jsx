import React, { useEffect, useState } from "react";
import AuthForm from "./components/authfrom.jsx";
import ProductFrom from "./components/productFrom.jsx";
import ProductsList from "./components/productsList.jsx";
import Inventarylog from "./components/Inventarylog.jsx";
import { supabase } from "./supabaseClientet.js";


export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    })();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="app-wrapper">
      <header className="topbar">
        <h1>Tienda Inventario — Tienda Verde</h1>
        {session && (
          <div>
            <button
              className="btn small"
              onClick={() => supabase.auth.signOut()}
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </header>

      <main className="container">
        {!session ? (
          <AuthForm />
        ) : (
          <>
            <section className="left-col">
              <ProductFrom />
              <ProductsList />
            </section>

            <aside className="right-col">
              <Inventarylog />
            </aside>
          </>
        )}
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Tienda Verde</p>
      </footer>
    </div>
  );
}
