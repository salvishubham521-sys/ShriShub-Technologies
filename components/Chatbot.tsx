"use client";
import { useState } from "react";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([{ role: "assistant", text: "Hi! Tell me what you want to build and I’ll help you choose a service." }]);

  async function send() {
    if (!input.trim()) return;
    const userText = input.trim();
    setMessages((m) => [...m, { role: "user", text: userText }]);
    setInput("");
    try {
      const r = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: userText, mode: "chat" }),
      });
      const data = await r.json();
      setMessages((m) => [...m, { role: "assistant", text: data.reply || "I can help you compare the available services." }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", text: "The AI service is temporarily unavailable. You can still browse services and submit requirements." }]);
    }
  }

  if (!open) return <button className="btn btn-primary" style={{position:"fixed",right:20,bottom:20,zIndex:50}} onClick={() => setOpen(true)}>✦ AI Assistant</button>;

  return <div className="chat">
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <strong>✦ AI Assistant</strong><button className="btn" onClick={() => setOpen(false)}>Close</button>
    </div>
    <div className="chat-log">
      {messages.map((m, i) => <div key={i} className={`bubble ${m.role === "user" ? "user" : ""}`}>{m.text}</div>)}
    </div>
    <div style={{display:"flex",gap:8}}>
      <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter" && send()} placeholder="Describe your idea..." />
      <button className="btn btn-primary" onClick={send}>Send</button>
    </div>
  </div>;
}
