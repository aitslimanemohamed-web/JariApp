"use client";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ProviderCTA() {
  const { t } = useLanguage();

  return (
    <section id="prestataires" style={{
      background: "linear-gradient(135deg, #1A3C5E 0%, #1B4F72 60%, #1E5F8A 100%)",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "280px", height: "280px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.04)" }} />
      <div style={{ position: "absolute", bottom: "-60px", left: "-60px", width: "200px", height: "200px", borderRadius: "50%", backgroundColor: "rgba(255,107,53,0.07)" }} />

      <div className="jari-wrap jari-section-py" style={{ maxWidth: "680px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{
          display: "inline-block", backgroundColor: "rgba(255,107,53,0.2)",
          color: "#FF9A72", fontWeight: 600, fontSize: "0.78rem",
          padding: "5px 14px", borderRadius: "100px", marginBottom: "18px",
          border: "1px solid rgba(255,107,53,0.25)",
        }}>
          💼 {t.nav.becomeProvider}
        </div>
        <h2 style={{
          color: "white", fontWeight: 900,
          fontSize: "clamp(1.4rem, 3.5vw, 2.4rem)", marginBottom: "14px",
          lineHeight: 1.2, letterSpacing: "-0.5px",
        }}>
          {t.provider.title}
        </h2>
        <p style={{
          color: "rgba(255,255,255,0.7)",
          fontSize: "clamp(0.9rem, 2vw, 1rem)",
          lineHeight: 1.8, marginBottom: "32px",
        }}>
          {t.provider.sub}
        </p>
        <Link href="/register" style={{
          display: "inline-block",
          background: "linear-gradient(135deg, #FF6B35, #FF5520)",
          color: "white", fontWeight: 700, fontSize: "1rem",
          padding: "14px 36px", borderRadius: "14px",
          boxShadow: "0 6px 24px rgba(255,107,53,0.5)",
          textDecoration: "none",
        }}>
          {t.provider.cta}
        </Link>
      </div>
    </section>
  );
}
