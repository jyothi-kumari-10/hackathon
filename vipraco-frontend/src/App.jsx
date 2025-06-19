import { useState } from "react";
import Chatbot from "./components/Chatbot";
import Login from "./components/Login";

function App() {
  const [userId, setUserId] = useState(null);
  const [orgId, setOrgId] = useState(null);

  const handleLogin = (id, org) => {
    setUserId(id);
    setOrgId(org);
  };

  const handleLogout = () => {
    setUserId(null);
    setOrgId(null);
  };

  return (
    <div className="App">
      
      <h1><img src="/bot-avatar.png" alt="Bot" className="chat-avatar" />VipraBot</h1>
      {!userId ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Chatbot userId={userId} orgId={orgId} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
