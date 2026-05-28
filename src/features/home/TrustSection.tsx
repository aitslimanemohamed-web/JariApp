"use client";
import { useLanguage } from "@/contexts/LanguageContext";

const TRUST_ICONS  = ["✓", "⚡", "🆓"];
const TRUST_KEYS   = ["verified", "fast", "free"] as const;
const TRUST_COLORS = ["#10B981", "#F59E0B", "#6366F1"];

export default function TrustSection() {
  const { t } = useLanguage();

  return (
    <section style={{ backgroundColor: "white", borderBottom: "1px solid #F0F0F0" }}>
      <div className="jari-wrap jari-section-py">
        <h2 style={{
          textAlign: "center", color: "#0F172A", fontWeight: 800,
          fontSize: "clamp(1.3rem, 3vw, 1.9rem)", marginBottom: "36px", letterSpacing: "-0.5px",
        }}>
          {t.trust.title}
        </h2>
        <div className="jari-grid-3">
          {TRUST_KEYS.map((key, i) => (
            <div key={key} style={{
              backgroundColor: "#FAFAFA", borderRadius: "16px",
              padding: "24px 20px", border: "1px solid #F0F0F0",
              display: "flex", alignItems: "flex-start", gap: "14px",
            }}>
              <div style={{
                width: "42px", height: "42px", borderRadius: "12px", flexShrink: 0,
                backgroundColor: `${TRUST_COLORS[i]}18`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.1rem", color: TRUST_COLORS[i], fontWeight: 700,
              }}>
                {TRUST_ICONS[i]}
              </div>
              <div>
                <div style={{ color: "#0F172A", fontWeight: 700, fontSize: "0.92rem", marginBottom: "5px" }}>
                  {t.trust[key].title}
                </div>
                <div style={{ color: "#64748B", fontSize: "0.84rem", lineHeight: 1.6 }}>
                  {t.trust[key].desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
