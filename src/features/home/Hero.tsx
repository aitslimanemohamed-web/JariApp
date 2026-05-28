"use client";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

const STATS = [
  { value: "500+", key: "providers" as const, icon: "👷" },
  { value: "48",   key: "cities"    as const, icon: "📍" },
  { value: "4.8★", key: "rating"   as const, icon: "⭐" },
];

export default function Hero() {
  const { t } = useLanguage();
  const { user } = useAuth();

  return (
    <section style={{ background: "linear-gradient(150deg, #fff 0%, #FFF8F5 50%, #FFF3EE 100%)", borderBottom: "1px solid #F0EBE8" }}>
      <div className="jari-wrap jari-hero-inner">

        <div style={{ marginBottom: "22px" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            backgroundColor: "#FFF0EB", color: "#FF6B35",
            fontWeight: 600, fontSize: "0.82rem",
            padding: "6px 16px", borderRadius: "100px",
            border: "1px solid #FFD8C8",
          }}>
            {t.hero.badge}
          </span>
        </div>

        <h1 style={{
          color: "#0F172A", fontWeight: 900,
          fontSize: "clamp(1.85rem, 5vw, 3.75rem)",
          lineHeight: 1.1, margin: "0 auto 18px",
          maxWidth: "760px", letterSpacing: "-1px",
        }}>
          {t.hero.line1}{" "}
          <span style={{
            backgroundImage: "linear-gradient(135deg, #FF6B35, #FF8C5A)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            {t.hero.highlight}
          </span>{" "}
          {t.hero.line2}
        </h1>

        <p style={{
          color: "#64748B", fontSize: "clamp(0.9rem, 2vw, 1.05rem)",
          lineHeight: 1.8, maxWidth: "520px", margin: "0 auto 32px",
        }}>
          {t.hero.sub}
        </p>

        <div className="jari-hero-ctas">
          <Link href={user ? "#services" : "/register"} style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            background: "linear-gradient(135deg, #FF6B35, #FF5520)",
            color: "white", fontWeight: 700, fontSize: "1rem",
            padding: "14px 32px", borderRadius: "14px",
            boxShadow: "0 4px 20px rgba(255,107,53,0.4)",
            textDecoration: "none",
          }}>
            {t.hero.cta1}
          </Link>
          <Link href="#comment-ca-marche" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            backgroundColor: "white", color: "#1B4F72", fontWeight: 600, fontSize: "1rem",
            padding: "14px 28px", borderRadius: "14px",
            border: "2px solid #E2E8F0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            textDecoration: "none",
          }}>
            {t.hero.cta2}
          </Link>
        </div>

        {!user && (
          <p style={{ color: "#94A3B8", fontSize: "0.875rem" }}>
            {t.hero.loginHint}{" "}
            <Link href="/login" style={{ color: "#FF6B35", fontWeight: 600, textDecoration: "none" }}>
              {t.hero.loginLink}
            </Link>
          </p>
        )}

        <div className="jari-stats">
          {STATS.map((stat) => (
            <div key={stat.key} className="jari-stat-item">
              <div style={{ fontSize: "1.2rem", marginBottom: "4px" }}>{stat.icon}</div>
              <div style={{ color: "#0F172A", fontWeight: 800, fontSize: "1.5rem", lineHeight: 1, letterSpacing: "-0.5px" }}>
                {stat.value}
              </div>
              <div style={{ color: "#94A3B8", fontSize: "0.72rem", marginTop: "4px", fontWeight: 500 }}>
                {t.stats[stat.key]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
