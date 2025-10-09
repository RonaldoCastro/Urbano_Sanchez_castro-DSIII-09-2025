// src/components/authfrom.jsx
import React, { useState } from "react";
import { supabase } from "../supabaseClient";

export default function AuthForm() {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const register = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (error) throw error;
      alert("Revisa tu correo para confirmar (si lo activaste) o ya estás registrado.");
    } catch (err) {
      alert(err.message);
    }
  };

  const login = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      // la suscripción del App actualizará la sesión
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="auth-card">
      <h2>{mode === "login" ? "Iniciar sesión" : "Registrarse"}</h2>
      <form onSubmit={mode === "login" ? login : register}>
        {mode === "register" && (
          <input
            placeholder="Nombre completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="auth-actions">
          <button type="submit" className="btn">
            {mode === "login" ? "Entrar" : "Registrar"}
          </button>
          <button
            type="button"
            className="btn secondary"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
          >
            {mode === "login" ? "Crear cuenta" : "Ya tengo cuenta"}
          </button>
        </div>
      </form>
    </div>
  );
}