import { useState } from "react";
import Chatbot from "./components/Chatbot";
import Login from "./components/Login";

function App() {
  const [userId, setUserId] = useState("");

  const handleLogout = () => {
    setUserId(""); // Clears userId → goes back to login screen
  };

  return (
    <div className="App">
      <h1>💬 VipraBot</h1>
      {!userId ? (
        <Login onLogin={setUserId} />
      ) : (
        <Chatbot userId={userId} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
