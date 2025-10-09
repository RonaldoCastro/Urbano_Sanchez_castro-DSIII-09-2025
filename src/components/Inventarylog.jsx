// src/components/Inventarylog.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Inventarylog() {
  const [logs, setLogs] = useState([]);

  const fetchLogs = async () => {
    const { data, error } = await supabase
      .from("movimientos")
      .select(`
        id,
        producto_id,
        tipo,
        cantidad,
        fecha,
        productos:productos(nombre)
      `)
      .order("fecha", { ascending: false })
      .limit(100);
    if (error) {
      console.error(error);
      return;
    }
    // adaptamos posible join manual
    const adapted = (data || []).map((r) => ({
      id: r.id,
      producto_id: r.producto_id,
      tipo: r.tipo,
      cantidad: r.cantidad,
      fecha: r.fecha,
      nombre: r.productos?.nombre || "—",
    }));
    setLogs(adapted);
  };

  useEffect(() => {
    fetchLogs();
    const onMov = () => fetchLogs();
    window.addEventListener("movimientosUpdated", onMov);
    return () => window.removeEventListener("movimientosUpdated", onMov);
  }, []);

  return (
    <div className="card">
      <h3>Historial de movimientos</h3>
      <div className="log-list">
        {logs.length === 0 && <p>No hay movimientos registrados.</p>}
        <ul>
          {logs.map((l) => (
            <li key={l.id}>
              <strong>{l.nombre}</strong> — {l.tipo} • {l.cantidad} • {new Date(l.fecha).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}