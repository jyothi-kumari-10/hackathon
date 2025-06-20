import { useState, useEffect } from "react";
import Chatbot from "./components/Chatbot";
import Login from "./components/Login";
import ChangePassword from "./components/ChangePassword";
import axios from "axios";
import "./App.css";
import ProfilePopup from "./components/ProfilePopup";

function App() {
  const [userId, setUserId] = useState(null);
  const [orgId, setOrgId] = useState(null);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showChangePass, setShowChangePass] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const handleLogin = (id, org, emailFromLogin) => {
    setUserId(id);
    setOrgId(org);
    setEmail(emailFromLogin);
    fetchUserFirstName(id); // fetch and store the first name
  };

  const fetchUserFirstName = async (id) => {
    try {
      const res = await axios.get(`http://localhost:3001/api/users/${id}`);
      setFirstName(res.data.first_name || "");
    } catch (err) {
      console.error("Failed to fetch user name for icon:", err);
    }
  };

  const handleLogout = () => {
    setUserId(null);
    setOrgId(null);
    setEmail("");
    setFirstName("");
    setShowMenu(false);
    setShowChangePass(false);
    setShowProfile(false);
  };

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/api/users/${userId}`);
      setProfileData(res.data);
      setShowProfile(true);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".profile-dropdown")) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="App">
      <div className="app-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px" }}>
        <h1 className="app-title" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src="/bot-avatar.png" alt="Bot" className="chat-avatar" /> VipraBot
        </h1>

        {userId && (
          <div className="profile-dropdown" style={{ position: "relative" }}>
            <button className="profile-btn" onClick={() => setShowMenu(!showMenu)} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  backgroundColor: "#0000FF",
                  color: "#fff",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontWeight: "bold",
                  fontSize: "18px"
                }}
              >
                {firstName?.charAt(0)?.toUpperCase() || "U"}
              </div>
            </button>
            {showMenu && (
              <div className="dropdown-menu" style={{ position: "absolute", right: 0, top: 36, background: "white", border: "1px solid #ccc", borderRadius: "6px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", padding: "8px", display: "flex", flexDirection: "column", zIndex: 99, minWidth: "220px" }}>
                <button onClick={fetchProfile} style={{ padding: "8px 12px", border: "none", background: "none", textAlign: "left", cursor: "pointer" }}>Profile</button>
                <button onClick={() => setShowChangePass(true)} style={{ padding: "8px 12px", border: "none", background: "none", textAlign: "left", cursor: "pointer" }}>Change Password</button>
                <button onClick={handleLogout} style={{ padding: "8px 12px", border: "none", background: "none", textAlign: "left", cursor: "pointer" }}>Logout</button>
              </div>
            )}
          </div>
        )}
      </div>

      {!userId ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          <Chatbot userId={userId} orgId={orgId} onLogout={handleLogout} />

          {showChangePass && (
            <div className="modal-overlay" style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 100 }}>
              <div className="modal-content" style={{ background: "white", padding: 20, borderRadius: 10, width: "90%", maxWidth: 400, position: "relative", border: "1px solid #ccc" }}>
                <button onClick={() => setShowChangePass(false)} style={{ position: "absolute", top: 10, right: 10, border: "none", background: "transparent", fontSize: 20, cursor: "pointer" }}>✖</button>
                <ChangePassword email={email} onSuccess={() => setShowChangePass(false)} />
              </div>
            </div>
          )}

          {showProfile && profileData && (
            <div className="modal-overlay" style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 100 }}>
              <div className="modal-content" style={{ background: "white", padding: 20, borderRadius: 10, width: "90%", maxWidth: 400, position: "relative", border: "1px solid #ccc" }}>
                <button onClick={() => setShowProfile(false)} style={{ position: "absolute", top: 10, right: 10, border: "none", background: "transparent", fontSize: 20, cursor: "pointer" }}>✖</button>
                <ProfilePopup profileData={profileData} />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
