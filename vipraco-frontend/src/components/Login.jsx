import { useState } from "react";
import axios from "axios";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:3001/api/auth/login", {
        email,
        password
      });

      if (res.data.success) {
        onLogin(res.data.userId, res.data.orgId); // Send userId to parent
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("Login failed");
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 400, margin: "50px auto", border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>🔐 Employee Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", marginBottom: 10, padding: 8 }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", marginBottom: 10, padding: 8 }}
      />
      <button onClick={handleLogin} style={{ width: "100%", padding: 10 }}>Login</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
