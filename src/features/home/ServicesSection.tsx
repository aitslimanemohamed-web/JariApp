"use client";
import { useLanguage } from "@/contexts/LanguageContext";

const SERVICES = [
  { icon: "🔧", color: "#FF6B35" },   // Plomberie
  { icon: "⚡", color: "#F59E0B" },   // Électricité
  { icon: "❄️", color: "#0EA5E9" },   // Climatisation
  { icon: "🚗", color: "#8B5CF6" },   // Mécanique
  { icon: "🧹", color: "#10B981" },   // Ménage
  { icon: "📚", color: "#6366F1" },   // Cours particuliers
  { icon: "🖌️", color: "#EC4899" },  // Peintre & Plâtrier
  { icon: "🚖", color: "#1B4F72" },   // Chauffeur
  { icon: "🧱", color: "#92400E" },   // Maçonnerie
  { icon: "💻", color: "#0F766E" },   // Informatique
  { icon: "📦", color: "#7C3AED" },   // Déménagement
  { icon: "🔌", color: "#DC2626" },   // Électroménager
];

export default function ServicesSection() {
  const { t } = useLanguage();

  return (
    <section id="services" style={{ backgroundColor: "#F8FAFC" }}>
      <div className="jari-wrap jari-section-py">
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <h2 style={{ color: "#0F172A", fontWeight: 800, fontSize: "clamp(1.3rem, 3vw, 1.9rem)", marginBottom: "8px", letterSpacing: "-0.5px" }}>
            {t.services.title}
          </h2>
          <p style={{ color: "#64748B", fontSize: "0.92rem" }}>{t.services.sub}</p>
        </div>
        <div className="jari-grid-services">
          {SERVICES.map((svc, i) => (
            <div key={i} style={{
              backgroundColor: "white", borderRadius: "16px",
              padding: "24px 10px 20px", textAlign: "center",
              border: "1px solid #EEF0F4", cursor: "pointer",
              transition: "all 0.2s", position: "relative", overflow: "hidden",
            }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(-3px)";
                el.style.boxShadow = `0 10px 28px ${svc.color}22`;
                el.style.borderColor = `${svc.color}44`;
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "none";
                el.style.boxShadow = "none";
                el.style.borderColor = "#EEF0F4";
              }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", backgroundColor: svc.color }} />
              <div style={{
                width: "48px", height: "48px", borderRadius: "14px", margin: "0 auto 10px",
                backgroundColor: `${svc.color}15`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.6rem",
              }}>
                {svc.icon}
              </div>
              <div style={{ color: "#1E293B", fontWeight: 600, fontSize: "0.82rem", lineHeight: 1.3 }}>
                {t.services.items[i]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
