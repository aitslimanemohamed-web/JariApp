"use client";
import { useLanguage } from "@/contexts/LanguageContext";

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, #FF6B35, #FF8C5A)",
  "linear-gradient(135deg, #6366F1, #818CF8)",
  "linear-gradient(135deg, #10B981, #34D399)",
];

export default function Testimonials() {
  const { t } = useLanguage();

  return (
    <section style={{ backgroundColor: "#F8FAFC", borderTop: "1px solid #F0F0F0" }}>
      <div className="jari-wrap jari-section-py">
        <h2 style={{
          textAlign: "center", color: "#0F172A", fontWeight: 800,
          fontSize: "clamp(1.3rem, 3vw, 1.9rem)", marginBottom: "36px", letterSpacing: "-0.5px",
        }}>
          {t.testimonials.title}
        </h2>
        <div className="jari-grid-testimonials">
          {t.testimonials.items.map((item, i) => (
            <div key={i} style={{
              backgroundColor: "white", borderRadius: "18px",
              padding: "24px 22px", border: "1px solid #EEF0F4",
              boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
            }}>
              <div style={{ color: "#F59E0B", fontSize: "0.85rem", marginBottom: "12px", letterSpacing: "2px" }}>
                ★★★★★
              </div>
              <p style={{ color: "#334155", lineHeight: 1.7, fontSize: "0.875rem", marginBottom: "18px", fontStyle: "italic" }}>
                "{item.text}"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: "38px", height: "38px", borderRadius: "50%", flexShrink: 0,
                  background: AVATAR_GRADIENTS[i],
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "white", fontWeight: 700, fontSize: "0.95rem",
                }}>
                  {item.name.charAt(0)}
                </div>
                <div>
                  <div style={{ color: "#0F172A", fontWeight: 700, fontSize: "0.85rem" }}>{item.name}</div>
                  <div style={{ color: "#94A3B8", fontSize: "0.75rem" }}>{item.role} · {item.city}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
