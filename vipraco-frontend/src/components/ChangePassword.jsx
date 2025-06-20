import { useState } from "react";
import axios from "axios";

export default function ChangePassword({ email, onSuccess }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleChange = async () => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if (!passwordRegex.test(newPassword)) {
      setMsg("New password must contain a capital letter, digit, and special character.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3001/api/auth/change-password", {
        email,
        currentPassword,
        newPassword
      });

      setMsg(res.data.message || "Password updated successfully");

      // 🔒 Auto close popup after 1.5 seconds
      setTimeout(() => {
        onSuccess(); // Closes the modal
      },500 );
    } catch (err) {
      setMsg(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div style={{
      maxWidth: 400,
      margin: "20px auto",
      padding: 20,
      border: "1px solid #ccc",
      borderRadius: 8
    }}>
      <h3>Change Password</h3>
      <input
        type="password"
        placeholder="Current Password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        style={{ width: "100%", marginBottom: 10, padding: 8 }}
      />
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        style={{ width: "100%", marginBottom: 10, padding: 8 }}
      />
      <button
        onClick={handleChange}
        disabled={!newPassword.trim() || newPassword.length < 6}
        style={{
          marginBottom: "10px",
          background: "#0000FF",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          padding: 10,
          width: "100%",
          opacity: (!newPassword.trim() || newPassword.length < 6) ? 0.6 : 1
        }}
      >
        Update Password
      </button>
      {msg && <p style={{ marginTop: 10 }}>{msg}</p>}
    </div>
  );
}
