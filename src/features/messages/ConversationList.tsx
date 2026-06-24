"use client";
import { type Conversation } from "./mockData";

interface Props {
  conversations: Conversation[];
  activeId: number;
  onSelect: (id: number) => void;
}

export default function ConversationList({ conversations, activeId, onSelect }: Props) {
  return (
    <div style={{
      width: "100%", height: "100%", overflowY: "auto",
      borderRight: "1px solid #EEF0F4",
    }}>
      {/* header */}
      <div style={{ padding: "20px 16px 12px", borderBottom: "1px solid #F4F6F8" }}>
        <h2 style={{ color: "#0F172A", fontWeight: 800, fontSize: "1rem", marginBottom: "12px" }}>
          Messages
        </h2>
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          backgroundColor: "#F4F6F8", borderRadius: "10px", padding: "8px 12px",
        }}>
          <span style={{ color: "#94A3B8", fontSize: "0.9rem" }}>🔍</span>
          <input
            placeholder="Rechercher..."
            style={{
              border: "none", background: "none", outline: "none",
              color: "#334155", fontSize: "0.85rem", width: "100%",
            }}
          />
        </div>
      </div>

      {/* liste */}
      <div>
        {conversations.map(conv => {
          const isActive = conv.id === activeId;
          return (
            <button
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: "12px",
                padding: "14px 16px", border: "none", cursor: "pointer", textAlign: "left",
                backgroundColor: isActive ? "#FFF0EB" : "transparent",
                borderLeft: isActive ? "3px solid #FF6B35" : "3px solid transparent",
                transition: "all 0.12s",
              }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC"; }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
            >
              {/* avatar */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div style={{
                  width: "42px", height: "42px", borderRadius: "50%",
                  background: "linear-gradient(135deg, #FF6B35, #FF8C5A)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "white", fontWeight: 800, fontSize: "0.88rem",
                }}>
                  {conv.initial}
                </div>
                {conv.online && (
                  <div style={{
                    position: "absolute", bottom: 1, right: 1,
                    width: "10px", height: "10px", borderRadius: "50%",
                    backgroundColor: "#10B981", border: "2px solid white",
                  }} />
                )}
              </div>

              {/* contenu */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2px" }}>
                  <span style={{ color: "#0F172A", fontWeight: conv.unread > 0 ? 700 : 600, fontSize: "0.87rem" }}>
                    {conv.name}
                  </span>
                  <span style={{ color: "#94A3B8", fontSize: "0.7rem", flexShrink: 0, marginLeft: "8px" }}>
                    {conv.time}
                  </span>
                </div>
                <div style={{ color: "#64748B", fontSize: "0.72rem", marginBottom: "3px", fontWeight: 500,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {conv.subject}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{
                    color: conv.unread > 0 ? "#334155" : "#94A3B8",
                    fontSize: "0.78rem", fontWeight: conv.unread > 0 ? 600 : 400,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    maxWidth: "150px",
                  }}>
                    {conv.lastMessage}
                  </span>
                  {conv.unread > 0 && (
                    <span style={{
                      backgroundColor: "#FF6B35", color: "white",
                      fontWeight: 700, fontSize: "0.65rem",
                      width: "18px", height: "18px", borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, marginLeft: "6px",
                    }}>
                      {conv.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
