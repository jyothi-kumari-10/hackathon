import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:3001/api/auth/login", {
        email,
        password
      });

      if (res.data.success) {
        onLogin(res.data.userId, res.data.orgId, email); // Send userId to parent
        navigate("/chatbot"); // Redirect to chatbot page
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("Login failed");
    }
  };

  return (
    
    <div style={{ padding: 20, maxWidth: 400, margin: "50px auto", border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>Employee Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", marginBottom: 10, padding: 8,boxSizing: "border-box" }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", marginBottom: 10, padding: 8,boxSizing: "border-box" }}
      />
      <button onClick={handleLogin} style={{ marginBottom: "10px",background: "#0000FF", color: "#fff",border: "none",borderRadius: "4px",cursor: "pointer",padding: 10, width: "100%" }}>Login</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
