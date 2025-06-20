import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./Chatbot.css";

export default function Chatbot({ userId, orgId, onLogout }) {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! How can I assist you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
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
    setMessages((msgs) => [...msgs, { from: "user", text: input }]);
    setLoading(true);
    setInput("");
    try {
      const res = await axios.post("http://localhost:3001/api/chat", {
        message: input,
        userId,
        orgId
      });
      setMessages((msgs) => [...msgs, { from: "bot", text: res.data.reply }]);
    } catch {
      setMessages((msgs) => [...msgs, { from: "bot", text: "Sorry, something went wrong." }]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", background: "#fff", borderRadius: 16, boxShadow: "0 2px 16px #0001", padding: 0 }}>
      {/* Animation */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", paddingTop: 24 }}>
        {/* Lottie animation via lottiefiles CDN */}
        <iframe src="https://lottie.host/embed/2b7e2b7e-2b7e-2b7e-2b7e-2b7e2b7e2b7e/2b7e2b7e.json" title="Chatbot Animation" style={{ width: 120, height: 120, border: "none", background: "none" }}></iframe>
      </div>
      <div style={{ padding: 24, minHeight: 350 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.from === "bot" ? "left" : "right", margin: "10px 0" }}>
            <span style={{
              display: "inline-block",
              background: msg.from === "bot" ? "#e3f2fd" : "#c8e6c9",
              color: "#222",
              borderRadius: 16,
              padding: "10px 18px",
              maxWidth: "80%",
              fontSize: 16
            }}>{msg.text}</span>
          </div>
        ))}
        {loading && (
          <div style={{ textAlign: "left", margin: "10px 0" }}>
            <span style={{ display: "inline-block", background: "#e3f2fd", borderRadius: 16, padding: "10px 18px", fontSize: 16 }}>
              <span className="dot-flashing"></span> <span style={{ marginLeft: 8 }}>VipraBot is typing...</span>
            </span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <div style={{ display: "flex", borderTop: "1px solid #eee", padding: 16, background: "#f4f8fb", borderRadius: "0 0 16px 16px" }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          style={{ flex: 1, padding: 12, borderRadius: 8, border: "1px solid #bbb", fontSize: 16 }}
        />
        <button onClick={sendMessage} style={{ marginLeft: 12, background: "#1a237e", color: "#fff", border: "none", borderRadius: 8, padding: "12px 24px", fontWeight: 600, fontSize: 16, cursor: "pointer" }}>Send</button>
      </div>
      {/* Simple CSS animation for loading */}
      <style>{`
        .dot-flashing {
          position: relative;
          width: 12px;
          height: 12px;
          border-radius: 6px;
          background-color: #1a237e;
          color: #1a237e;
          animation: dotFlashing 1s infinite linear alternate;
        }
        @keyframes dotFlashing {
          0% { opacity: 1; }
          50%, 100% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
