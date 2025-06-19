import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Chatbot.css";

export default function Chatbot({ userId,orgId, onLogout }) {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I’m VipraBot. Ask me about your leave, manager, DOJ, etc." }
  ]);
  const [input, setInput] = useState("");

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Log userId on first load
  useEffect(() => {
    console.log("Using userId:", userId);
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await axios.post("http://localhost:3001/api/chat", {
  message: input,
  userId: userId,
  orgId: orgId 
});

      const botMessage = { sender: "bot", text: res.data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { sender: "bot", text: "⚠️ Sorry, server error." }]);
    }

    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
  <div className="chat-container">
    {/* 🔓 Logout button */}
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <button
        onClick={onLogout}
        style={{
          marginBottom: "10px",
          padding: "6px 12px",
          background: "#0000FF",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Logout
      </button>
    </div>

    {/* 💬 Chat messages */}
    <div className="chat-box">
      {messages.map((msg, i) => (
        <div key={i} className={`chat-message-row ${msg.sender}`}>
          {msg.sender === "bot" && (
            <img src="/bot-avatar.png" alt="Bot" className="chat-avatar" />
          )}

          <div className={`chat-bubble ${msg.sender}`}>{msg.text}</div>

          {msg.sender === "user" && (
            <img src="/user-avatar.png" alt="You" className="chat-avatar" />
          )}
        </div>
      ))}
      <div ref={chatEndRef} />
    </div>

    {/* 📝 Input area */}
    <div className="chat-input">
      <input
        type="text"
        placeholder="Type your question..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  </div>
);

}
