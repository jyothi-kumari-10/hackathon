import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Chatbot from "./components/Chatbot";
import Login from "./components/Login";
import ChangePassword from "./components/ChangePassword";
import LoginSelection from "./components/LoginSelection";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import "./App.css"; // Optional for styling

function App() {
  const [userId, setUserId] = useState(null);
  const [orgId, setOrgId] = useState(null);
  const [email, setEmail] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showChangePass, setShowChangePass] = useState(false);

  const handleLogin = (id, org, emailFromLogin) => {
    setUserId(id);
    setOrgId(org);
    setEmail(emailFromLogin);
  };

  const handleLogout = () => {
    setUserId(null);
    setOrgId(null);
    setEmail("");
    setShowMenu(false);
    setShowChangePass(false);
  };

  return (
    <Router>
      <div className="App">
        <div className="app-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px" }}>
          <h1 className="app-title" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img src="/bot-avatar.png" alt="Bot" className="chat-avatar" /> VipraBot
          </h1>
          {userId && (
            <div className="profile-dropdown" style={{ position: "relative" }}>
              <button className="profile-btn" onClick={() => setShowMenu(!showMenu)} style={{ fontSize: "24px", background: "none", border: "none", cursor: "pointer" }}>👤</button>
              {showMenu && (
                <div className="dropdown-menu" style={{ position: "absolute", right: 0, top: 36, background: "white", border: "1px solid #ccc", borderRadius: "6px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", padding: "8px", display: "flex", flexDirection: "column", zIndex: 99 }}>
                  <button onClick={() => setShowChangePass(true)} style={{ padding: "8px 12px", border: "none", background: "none", textAlign: "left", cursor: "pointer" }}>Change Password</button>
                  <button onClick={handleLogout} style={{ padding: "8px 12px", border: "none", background: "none", textAlign: "left", cursor: "pointer" }}>Logout</button>
                </div>
              )}
            </div>
          )}
        </div>
        <Routes>
          <Route path="/" element={<LoginSelection />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/chatbot" element={userId ? <Chatbot userId={userId} orgId={orgId} onLogout={handleLogout} /> : <Login onLogin={handleLogin} />} />
        </Routes>
        {/* Popup modal for Change Password */}
        {showChangePass && (
          <div className="modal-overlay" style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 100 }}>
            <div className="modal-content" style={{ background: "white", padding: 20, borderRadius: 10, width: "90%", maxWidth: 400, position: "relative" }}>
              <button onClick={() => setShowChangePass(false)} style={{ position: "absolute", top: 10, right: 10, border: "none", background: "transparent", fontSize: 20, cursor: "pointer" }}>✖</button>
              <ChangePassword email={email} onSuccess={() => {
                setShowChangePass(false);
                handleLogout();
              }} />
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
