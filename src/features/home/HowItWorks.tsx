"use client";
import { useLanguage } from "@/contexts/LanguageContext";

const STEP_STYLES = [
  { gradient: "linear-gradient(135deg, #FF6B35, #FF8C5A)", shadow: "0 5px 14px rgba(255,107,53,0.35)" },
  { gradient: "linear-gradient(135deg, #1B4F72, #2E6CA0)", shadow: "0 5px 14px rgba(27,79,114,0.3)" },
  { gradient: "linear-gradient(135deg, #10B981, #34D399)", shadow: "0 5px 14px rgba(16,185,129,0.3)" },
];

export default function HowItWorks() {
  const { t } = useLanguage();

  return (
    <section id="comment-ca-marche" style={{ backgroundColor: "white" }}>
      <div className="jari-wrap jari-section-py">
        <div style={{ textAlign: "center", marginBottom: "44px" }}>
          <h2 style={{ color: "#0F172A", fontWeight: 800, fontSize: "clamp(1.3rem, 3vw, 1.9rem)", marginBottom: "8px", letterSpacing: "-0.5px" }}>
            {t.how.title}
          </h2>
          <p style={{ color: "#64748B", fontSize: "0.92rem" }}>{t.how.sub}</p>
        </div>
        <div className="jari-grid-3">
          {t.how.steps.map((step, i) => (
            <div key={i} style={{
              textAlign: "center", padding: "32px 24px 28px",
              backgroundColor: "#F8FAFC", borderRadius: "20px",
              border: "1px solid #EEF0F4",
            }}>
              <div style={{
                width: "52px", height: "52px", borderRadius: "16px", margin: "0 auto 18px",
                background: STEP_STYLES[i].gradient,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontWeight: 900, fontSize: "1.3rem",
                boxShadow: STEP_STYLES[i].shadow,
              }}>
                {i + 1}
              </div>
              <h3 style={{ color: "#0F172A", fontWeight: 700, fontSize: "0.95rem", marginBottom: "8px" }}>
                {step.title}
              </h3>
              <p style={{ color: "#64748B", lineHeight: 1.7, fontSize: "0.84rem" }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
