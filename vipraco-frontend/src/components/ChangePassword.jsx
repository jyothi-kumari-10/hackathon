import { useState } from "react";
import axios from "axios";

export default function ChangePassword({ email }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleChange = async () => {
    try {
      const res = await axios.post("http://localhost:3001/api/auth/change-password", {
        email,
        currentPassword,
        newPassword
      });

      setMsg(res.data.message);
    } catch (err) {
      setMsg(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "20px auto", padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
      <h3>🔐 Change Password</h3>
      <input
        type="password"
        placeholder="Current Password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        style={{ width: "100%",marginBottom: 10,padding: 8,boxSizing: "border-box"}}
      />
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        style={{ width: "100%",marginBottom: 10,padding: 8,boxSizing: "border-box" }}
      />
      <button onClick={handleChange} style={{ marginBottom: "10px",background: "#0000FF", color: "#fff",border: "none",borderRadius: "4px",cursor: "pointer",padding: 10, width: "100%" }}>
        Update Password
      </button>
      {msg && <p style={{ marginTop: 10 }}>{msg}</p>}
    </div>
  );
}
