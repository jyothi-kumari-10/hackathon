import React from "react";
import { useNavigate } from "react-router-dom";
import ChatBotImg from "../assets/undraw_chat-bot_44el.svg";

export default function LoginSelection() {
  const navigate = useNavigate();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minHeight: "100vh", background: "#f4f8fb", padding: 0 }}>
      <img src={ChatBotImg} alt="VipraCo Employee Assistant" style={{ width: 220, marginTop: 40, marginBottom: 10 }} />
      <h1 style={{ fontWeight: 800, fontSize: 36, margin: 0, color: "#1a237e", letterSpacing: 1 }}>VipraCo Employee Assistance</h1>
      <p style={{ fontSize: 18, color: "#333", margin: "12px 0 32px 0", maxWidth: 600, textAlign: "center" }}>
        Your smart HR assistant for seamless employee support.
      </p>
      <div style={{ display: "flex", gap: 60, background: "#fff", padding: 40, borderRadius: 16, boxShadow: "0 2px 16px #0001", marginBottom: 40 }}>
        <div style={{ minWidth: 350, textAlign: "center" }}>
          <div style={{ marginBottom: 16 }}>
            <span style={{ background: "#1a237e", color: "#fff", borderRadius: 8, padding: "4px 16px", fontWeight: 700, fontSize: 14 }}>ADMIN</span>
          </div>
          <h2 style={{ fontWeight: 700, fontSize: 26, margin: 0 }}>For Administrators</h2>
          <p style={{ color: "#444", fontSize: 16, margin: "12px 0 24px 0" }}>
            Manage your company, onboard employees, and streamline HR operations with VipraCo's powerful admin tools.
          </p>
          <button onClick={() => navigate("/admin-login")} style={{ margin: "24px 0 8px 0", background: "#1a237e", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", padding: 12, width: "70%", fontSize: 16, fontWeight: 600 }}>Admin Login</button>
          
        </div>
        <div style={{ minWidth: 350, textAlign: "center" }}>
          <div style={{ marginBottom: 16 }}>
            <span style={{ background: "#00bcd4", color: "#fff", borderRadius: 8, padding: "4px 16px", fontWeight: 700, fontSize: 14 }}>EMPLOYEE</span>
          </div>
          <h2 style={{ fontWeight: 700, fontSize: 26, margin: 0 }}>For Employees</h2>
          <p style={{ color: "#444", fontSize: 16, margin: "12px 0 24px 0" }}>
            Access your personal HR assistant for leave requests, payroll info, and company policies. Get instant help, anytime.
          </p>
          <button onClick={() => navigate("/login")} style={{ margin: "24px 0 8px 0", background: "#fff", color: "#00bcd4", border: "2px solid #00bcd4", borderRadius: 4, cursor: "pointer", padding: 12, width: "70%", fontSize: 16, fontWeight: 600 }}>Employee Login</button>
          
        </div>
      </div>
    </div>
  );
} 