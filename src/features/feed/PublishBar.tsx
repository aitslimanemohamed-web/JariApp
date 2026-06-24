"use client";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import ServiceModal from "@/features/services/ServiceModal";
import { type Annonce } from "@/lib/api";

type ServiceMode = "proposer" | "demander";

const TYPE_META = [
  { key: "service",  icon: "🔧", color: "#FF6B35", bg: "#FFF0EB" },
  { key: "vente",    icon: "🏷️", color: "#1B4F72", bg: "#EFF6FF" },
  { key: "demande",  icon: "🔍", color: "#10B981", bg: "#ECFDF5" },
  { key: "emploi",   icon: "💼", color: "#7C3AED", bg: "#F5F3FF" },
  { key: "location", icon: "🔑", color: "#D97706", bg: "#FFFBEB" },
] as const;

interface Props { onNewAnnonce?: (a: Annonce) => void; }

export default function PublishBar({ onNewAnnonce }: Props) {
  const [open, setOpen] = useState(false);
  const [serviceModal, setServiceModal] = useState<ServiceMode | null>(null);
  const { t } = useLanguage();

  const handleTypeClick = (key: string) => {
    if (key === "service") { setOpen(false); setServiceModal("proposer"); return; }
    if (key === "demande") { setOpen(false); setServiceModal("demander"); return; }
    // vente, emploi, location → à développer plus tard
  };

  return (
    <>
      <div style={{ marginBottom: "28px" }}>
        {!open ? (
          <button
            onClick={() => setOpen(true)}
            style={{
              width: "100%", padding: "15px 20px",
              borderRadius: "14px", border: "2px dashed #FFD8C8",
              backgroundColor: "#FFF8F5", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "12px",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.borderColor = "#FF6B35";
              el.style.backgroundColor = "#FFF0EB";
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.borderColor = "#FFD8C8";
              el.style.backgroundColor = "#FFF8F5";
            }}
          >
            <div style={{
              width: "36px", height: "36px", borderRadius: "10px", flexShrink: 0,
              background: "linear-gradient(135deg, #FF6B35, #FF5520)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontWeight: 900, fontSize: "1.3rem",
              boxShadow: "0 3px 10px rgba(255,107,53,0.35)",
            }}>
              +
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ color: "#FF6B35", fontWeight: 700, fontSize: "0.92rem" }}>
                {t.feed.publishBtn}
              </div>
              <div style={{ color: "#94A3B8", fontSize: "0.78rem" }}>
                {t.feed.publishSubtitle}
              </div>
            </div>
          </button>
        ) : (
          <div style={{
            backgroundColor: "white", borderRadius: "16px",
            border: "1px solid #EEF0F4", padding: "20px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <span style={{ color: "#0F172A", fontWeight: 700, fontSize: "0.95rem" }}>
                {t.feed.publishTitle}
              </span>
              <button onClick={() => setOpen(false)} style={{
                background: "none", border: "none", cursor: "pointer",
                color: "#94A3B8", fontSize: "1.2rem", lineHeight: 1,
              }}>×</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "10px" }}>
              {TYPE_META.map(tm => (
                <button key={tm.key}
                  onClick={() => handleTypeClick(tm.key)}
                  style={{
                    padding: "16px 10px", borderRadius: "12px", cursor: "pointer",
                    border: `1.5px solid ${tm.color}33`,
                    backgroundColor: tm.bg,
                    display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "none"; }}
                >
                  <span style={{ fontSize: "1.6rem" }}>{tm.icon}</span>
                  <span style={{ color: tm.color, fontWeight: 700, fontSize: "0.78rem", textAlign: "center", lineHeight: 1.3 }}>
                    {t.feed.publish[tm.key]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {serviceModal && (
        <ServiceModal
          initialMode={serviceModal}
          onClose={() => setServiceModal(null)}
          onSuccess={a => { onNewAnnonce?.(a); setServiceModal(null); }}
        />
      )}
    </>
  );
}
