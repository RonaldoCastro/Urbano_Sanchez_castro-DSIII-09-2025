// src/components/productFrom.jsx
import React, { useState } from "react";
import { supabase } from "../supabaseClient";

export default function ProductFrom() {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");

  const clear = () => {
    setNombre("");
    setPrecio("");
    setStock("");
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("productos").insert([
        {
          nombre: nombre.trim(),
          precio: parseFloat(precio) || 0,
          stock: parseInt(stock) || 0,
        },
      ]);
      if (error) throw error;
      // Notificar a la lista (evento simple)
      window.dispatchEvent(new Event("productosUpdated"));
      alert("Producto agregado correctamente.");
      clear();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="card">
      <h3>Agregar producto</h3>
      <form onSubmit={handleAdd} className="form-vertical">
        <input
          placeholder="Nombre del producto"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          type="number"
          step="0.01"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />
        <div style={{display:'flex', gap:10}}>
          <button className="btn" type="submit">Guardar</button>
          <button type="button" className="btn secondary" onClick={clear}>Limpiar</button>
        </div>
      </form>
    </div>
  );
}