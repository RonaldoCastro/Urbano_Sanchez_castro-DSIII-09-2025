// src/components/productsList.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function ProductsList() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProductos = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("productos").select("*").order("id", { ascending: false });
    setLoading(false);
    if (error) {
      console.error(error);
      return;
    }
    setProductos(data || []);
  };

  useEffect(() => {
    fetchProductos();
    const onUpdate = () => fetchProductos();
    window.addEventListener("productosUpdated", onUpdate);
    return () => window.removeEventListener("productosUpdated", onUpdate);
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este producto?")) return;
    const { error } = await supabase.from("productos").delete().eq("id", id);
    if (error) return alert(error.message);
    window.dispatchEvent(new Event("productosUpdated"));
  };

  const handleEdit = async (p) => {
    const nuevoNombre = prompt("Nombre", p.nombre) || p.nombre;
    const nuevoPrecio = prompt("Precio", p.precio) || p.precio;
    const nuevoStock = prompt("Stock", p.stock) || p.stock;

    const { error } = await supabase
      .from("productos")
      .update({
        nombre: nuevoNombre,
        precio: parseFloat(nuevoPrecio),
        stock: parseInt(nuevoStock),
      })
      .eq("id", p.id);

    if (error) return alert(error.message);
    window.dispatchEvent(new Event("productosUpdated"));
  };

  const decreaseStock = async (p) => {
    const cantidad = parseInt(prompt("¿Cuánto descontar?", "1")) || 0;
    if (cantidad <= 0) return;
    const newStock = Math.max(0, p.stock - cantidad);

    // actualizar stock y registrar movimiento
    const { error: e1 } = await supabase.from("productos").update({ stock: newStock }).eq("id", p.id);
    const { error: e2 } = await supabase.from("movimientos").insert([
      { producto_id: p.id, tipo: "salida", cantidad },
    ]);

    if (e1 || e2) {
      alert((e1 || e2).message || "Error al actualizar.");
    } else {
      window.dispatchEvent(new Event("productosUpdated"));
      window.dispatchEvent(new Event("movimientosUpdated"));
    }
  };

  const increaseStock = async (p) => {
    const cantidad = parseInt(prompt("¿Cuánto agregar?", "1")) || 0;
    if (cantidad <= 0) return;
    const newStock = p.stock + cantidad;

    const { error: e1 } = await supabase.from("productos").update({ stock: newStock }).eq("id", p.id);
    const { error: e2 } = await supabase.from("movimientos").insert([
      { producto_id: p.id, tipo: "entrada", cantidad },
    ]);

    if (e1 || e2) {
      alert((e1 || e2).message || "Error al actualizar.");
    } else {
      window.dispatchEvent(new Event("productosUpdated"));
      window.dispatchEvent(new Event("movimientosUpdated"));
    }
  };

  return (
    <div className="card">
      <h3>Inventario</h3>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nombre}</td>
                <td>{Number(p.precio).toFixed(2)}</td>
                <td>{p.stock}</td>
                <td>
                  <button className="btn small" onClick={() => increaseStock(p)}>+</button>
                  <button className="btn small" onClick={() => decreaseStock(p)}>-</button>
                  <button className="btn small secondary" onClick={() => handleEdit(p)}>Editar</button>
                  <button className="btn small danger" onClick={() => handleDelete(p.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
            {productos.length === 0 && (
              <tr>
                <td colSpan="5">No hay productos.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}