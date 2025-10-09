import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app.jsx";
import "./styles.css";

import { supabase } from "/supabaseclientet.js";

// Puedes mantener esta prueba si quieres
async function probarConexion() {
  const { data, error } = await supabase.from("productos").select("*");
  if (error) {
    console.error("❌ Error al conectar con Supabase:", error.message);
  } else {
    console.log("✅ Conexión exitosa. Datos:", data);
  }
}
probarConexion();

// ✅ Renderizar tu aplicación
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
