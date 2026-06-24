"use client";
import { useState, useRef, useEffect } from "react";
import { type Conversation, type Message } from "./mockData";

interface Props {
  conversation: Conversation;
  onBack: () => void;
}

export default function ChatWindow({ conversation, onBack }: Props) {
  const [messages, setMessages] = useState<Message[]>(conversation.messages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(conversation.messages);
  }, [conversation.id, conversation.messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setSending(true);
    const newMsg: Message = { id: Date.now(), from: "me", text, time: "maintenant" };
    setMessages(prev => [...prev, newMsg]);
    setInput("");
    setTimeout(() => setSending(false), 300);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* header */}
      <div style={{
        padding: "14px 20px", borderBottom: "1px solid #EEF0F4",
        display: "flex", alignItems: "center", gap: "12px", backgroundColor: "white",
        flexShrink: 0,
      }}>
        {/* bouton retour mobile */}
        <button onClick={onBack} className="jari-back-btn" style={{
          background: "none", border: "none",
          cursor: "pointer", color: "#64748B", fontSize: "1.1rem", padding: "4px",
        }}>←</button>

        <div style={{ position: "relative", flexShrink: 0 }}>
          <div style={{
            width: "38px", height: "38px", borderRadius: "50%",
            background: "linear-gradient(135deg, #FF6B35, #FF8C5A)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontWeight: 800, fontSize: "0.85rem",
          }}>
            {conversation.initial}
          </div>
          {conversation.online && (
            <div style={{
              position: "absolute", bottom: 1, right: 1,
              width: "9px", height: "9px", borderRadius: "50%",
              backgroundColor: "#10B981", border: "2px solid white",
            }} />
          )}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ color: "#0F172A", fontWeight: 700, fontSize: "0.9rem" }}>
            {conversation.name}
          </div>
          <div style={{ color: conversation.online ? "#10B981" : "#94A3B8", fontSize: "0.72rem", fontWeight: 500 }}>
            {conversation.online ? "En ligne" : "Hors ligne"} · {conversation.subject}
          </div>
        </div>

        <button style={{
          background: "none", border: "none", cursor: "pointer",
          color: "#94A3B8", fontSize: "1.2rem", padding: "4px 8px",
        }}>⋯</button>
      </div>

      {/* messages */}
      <div style={{
        flex: 1, overflowY: "auto", padding: "20px 16px",
        display: "flex", flexDirection: "column", gap: "10px",
        backgroundColor: "#F8FAFC",
      }}>
        {messages.map(msg => {
          const isMe = msg.from === "me";
          return (
            <div key={msg.id} style={{
              display: "flex", flexDirection: "column",
              alignItems: isMe ? "flex-end" : "flex-start",
            }}>
              <div style={{
                maxWidth: "72%", padding: "10px 14px", borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                backgroundColor: isMe ? "#FF6B35" : "white",
                color: isMe ? "white" : "#334155",
                fontSize: "0.85rem", lineHeight: 1.5, fontWeight: 400,
                boxShadow: isMe ? "0 2px 8px rgba(255,107,53,0.25)" : "0 1px 4px rgba(0,0,0,0.06)",
                border: isMe ? "none" : "1px solid #EEF0F4",
              }}>
                {msg.text}
              </div>
              <span style={{ color: "#94A3B8", fontSize: "0.68rem", marginTop: "3px", padding: "0 4px" }}>
                {msg.time}
              </span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* input */}
      <div style={{
        padding: "12px 16px", borderTop: "1px solid #EEF0F4",
        backgroundColor: "white", display: "flex", gap: "10px", alignItems: "flex-end",
        flexShrink: 0,
      }}>
        <div style={{
          flex: 1, backgroundColor: "#F4F6F8", borderRadius: "14px",
          padding: "10px 14px", display: "flex", alignItems: "center", gap: "8px",
          border: "1.5px solid transparent", transition: "border-color 0.15s",
        }}
        onFocus={() => {}} // handled via CSS alternative below
        >
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Écrire un message..."
            rows={1}
            style={{
              flex: 1, border: "none", background: "none", outline: "none",
              color: "#334155", fontSize: "0.88rem", resize: "none", lineHeight: 1.5,
              fontFamily: "inherit",
            }}
          />
          <button style={{
            background: "none", border: "none", cursor: "pointer",
            color: "#CBD5E1", fontSize: "1.1rem", flexShrink: 0,
          }}>📎</button>
        </div>
        <button
          onClick={send}
          disabled={!input.trim() || sending}
          style={{
            width: "40px", height: "40px", borderRadius: "12px", border: "none",
            background: input.trim() ? "linear-gradient(135deg, #FF6B35, #FF5520)" : "#E5E5E5",
            color: "white", cursor: input.trim() ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.9rem", flexShrink: 0,
            boxShadow: input.trim() ? "0 3px 10px rgba(255,107,53,0.35)" : "none",
            transition: "all 0.15s",
          }}
        >
          ➤
        </button>
      </div>
    </div>
  );
}
