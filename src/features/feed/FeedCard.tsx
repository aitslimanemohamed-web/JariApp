"use client";

export type AnnonceType = "service" | "vente" | "demande" | "emploi";

export interface Annonce {
  id: number;
  type: AnnonceType;
  category: string;
  categoryIcon: string;
  title: string;
  description: string;
  author: string;
  authorInitial: string;
  wilaya: string;
  price?: string;
  time: string;
  isOwn?: boolean;
  emploiSens?: "recrute" | "candidate";
}

const TYPE_CONFIG: Record<AnnonceType, { label: string; color: string; bg: string }> = {
  service: { label: "Service",  color: "#FF6B35", bg: "#FFF0EB" },
  vente:   { label: "Vente",    color: "#1B4F72", bg: "#EFF6FF" },
  demande: { label: "Demande",  color: "#10B981", bg: "#ECFDF5" },
  emploi:  { label: "Emploi",   color: "#7C3AED", bg: "#F5F3FF" },
};

export default function FeedCard({ annonce }: { annonce: Annonce }) {
  const cfg = TYPE_CONFIG[annonce.type];

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "16px",
        border: "1px solid #EEF0F4",
        padding: "18px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        cursor: "pointer",
        transition: "all 0.2s",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "translateY(-2px)";
        el.style.boxShadow = `0 8px 24px ${cfg.color}18`;
        el.style.borderColor = `${cfg.color}44`;
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "none";
        el.style.boxShadow = "none";
        el.style.borderColor = "#EEF0F4";
      }}
    >
      {/* barre colorée en haut */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", backgroundColor: cfg.color }} />

      {/* badges */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", marginTop: "4px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{
            backgroundColor: cfg.bg, color: cfg.color,
            fontWeight: 700, fontSize: "0.72rem",
            padding: "3px 10px", borderRadius: "100px",
            letterSpacing: "0.3px",
          }}>
            {annonce.type === "emploi" && annonce.emploiSens === "recrute" ? "Recrute" :
             annonce.type === "emploi" && annonce.emploiSens === "candidate" ? "Candidate" :
             cfg.label}
          </span>
          <span style={{ fontSize: "0.8rem", color: "#64748B" }}>
            {annonce.categoryIcon} {annonce.category}
          </span>
        </div>
        {annonce.isOwn && (
          <span style={{ fontSize: "0.68rem", color: "#94A3B8", fontWeight: 600 }}>MON ANNONCE</span>
        )}
      </div>

      {/* contenu */}
      <div>
        <div style={{ color: "#0F172A", fontWeight: 700, fontSize: "0.92rem", marginBottom: "5px", lineHeight: 1.3 }}>
          {annonce.title}
        </div>
        <div style={{ color: "#64748B", fontSize: "0.82rem", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {annonce.description}
        </div>
      </div>

      {/* footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #F4F6F8", paddingTop: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            width: "26px", height: "26px", borderRadius: "50%", flexShrink: 0,
            background: "linear-gradient(135deg, #FF6B35, #FF8C5A)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontWeight: 700, fontSize: "0.72rem",
          }}>
            {annonce.authorInitial}
          </div>
          <div>
            <div style={{ color: "#334155", fontWeight: 600, fontSize: "0.78rem" }}>{annonce.author}</div>
            <div style={{ color: "#94A3B8", fontSize: "0.7rem" }}>📍 {annonce.wilaya} · {annonce.time}</div>
          </div>
        </div>
        {annonce.price && (
          <div style={{ color: cfg.color, fontWeight: 700, fontSize: "0.85rem", textAlign: "right", flexShrink: 0 }}>
            {annonce.price}
          </div>
        )}
      </div>
    </div>
  );
}
