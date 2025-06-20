import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:3001/api/admin/login", { email, password });
      if (res.data.success) {
        localStorage.setItem("adminId", res.data.adminId);
        localStorage.setItem("adminName", res.data.name);
        navigate("/admin-dashboard");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("Login failed");
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 400, margin: "50px auto", border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>Admin Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ width: "100%", marginBottom: 10, padding: 8, boxSizing: "border-box" }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ width: "100%", marginBottom: 10, padding: 8, boxSizing: "border-box" }}
      />
      <button onClick={handleLogin} style={{ marginBottom: 10, background: "#0000FF", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", padding: 10, width: "100%" }}>Login</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
} 