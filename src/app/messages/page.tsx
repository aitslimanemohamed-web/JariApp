"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import ConversationList from "@/features/messages/ConversationList";
import ChatWindow from "@/features/messages/ChatWindow";
import { CONVERSATIONS } from "@/features/messages/mockData";

export default function MessagesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeId, setActiveId] = useState(CONVERSATIONS[0].id);
  const [showChat, setShowChat] = useState(false); // mobile toggle

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  if (loading || !user) return null;

  const activeConv = CONVERSATIONS.find(c => c.id === activeId)!;

  const handleSelect = (id: number) => {
    setActiveId(id);
    setShowChat(true);
  };

  return (
    <>
      <Navbar />
      <main style={{ backgroundColor: "#F8FAFC", height: "calc(100vh - 64px)", display: "flex", overflow: "hidden" }}>
        <div className="jari-wrap" style={{
          flex: 1, display: "flex", gap: "0",
          padding: "24px 0", maxWidth: "1100px",
          overflow: "hidden",
        }}>
          <div style={{
            display: "flex", width: "100%", height: "100%",
            backgroundColor: "white", borderRadius: "20px",
            border: "1px solid #EEF0F4",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            overflow: "hidden",
          }}>
            {/* Panel gauche — liste */}
            <div style={{
              width: "320px", flexShrink: 0, height: "100%", overflowY: "auto",
              flexDirection: "column",
            }}
            className={`jari-conv-list${showChat ? " jari-hidden-mobile" : ""}`}
            >
              <ConversationList
                conversations={CONVERSATIONS}
                activeId={activeId}
                onSelect={handleSelect}
              />
            </div>

            {/* Séparateur vertical */}
            <div style={{ width: "1px", backgroundColor: "#EEF0F4", flexShrink: 0 }} className="jari-conv-sep" />

            {/* Panel droit — chat */}
            <div style={{ flex: 1, height: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              {activeConv ? (
                <ChatWindow
                  conversation={activeConv}
                  onBack={() => setShowChat(false)}
                />
              ) : (
                <div style={{
                  flex: 1, display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  color: "#94A3B8", gap: "12px",
                }}>
                  <div style={{ fontSize: "3rem" }}>💬</div>
                  <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                    Sélectionnez une conversation
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
