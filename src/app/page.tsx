"use client";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { useLanguage } from "@/contexts/LanguageContext";

const SERVICE_ICONS = ["🔧", "⚡", "🧹", "📚", "🎨", "❄️", "🚗", "📦"];
const STATS = [
  { value: "500+", key: "providers" as const },
  { value: "48",   key: "cities"    as const },
  { value: "⭐ 4.8", key: "rating"  as const },
];

const inner: React.CSSProperties = {
  maxWidth: "1152px",
  margin: "0 auto",
  padding: "0 24px",
  width: "100%",
};

export default function HomePage() {
  const { t, dir } = useLanguage();

  return (
    <div dir={dir} style={{ width: "100%", minHeight: "100vh" }}>
      <Navbar />

      {/* ── Hero ── */}
      <section style={{ background: "linear-gradient(160deg, #FDFCFB 0%, #FFF7F4 100%)", width: "100%" }}>
        <div style={{ ...inner, paddingTop: "96px", paddingBottom: "96px", textAlign: "center" }}>

          <span style={{
            backgroundColor: "#FFF0EB", color: "#FF6B35", fontWeight: 600,
            fontSize: "0.85rem", padding: "6px 18px", borderRadius: "100px",
            border: "1px solid #FFD8C8", display: "inline-block", marginBottom: "28px",
          }}>
            {t.hero.badge}
          </span>

          <h1 style={{
            color: "#1A1A2E", fontWeight: 800,
            fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
            lineHeight: 1.12,
            maxWidth: "760px", margin: "0 auto 20px",
          }}>
            {t.hero.line1}{" "}
            <span style={{ color: "#FF6B35", borderBottom: "4px solid #FFD8C8", paddingBottom: "2px" }}>
              {t.hero.highlight}
            </span>{" "}
            {t.hero.line2}
          </h1>

          <p style={{
            color: "#666", fontSize: "1.1rem", lineHeight: 1.75,
            maxWidth: "520px", margin: "0 auto 36px",
          }}>
            {t.hero.sub}
          </p>

          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/register" style={{
              backgroundColor: "#FF6B35", color: "white", fontWeight: 700,
              fontSize: "1rem", padding: "15px 36px", borderRadius: "12px",
              boxShadow: "0 4px 18px rgba(255,107,53,0.35)", display: "inline-block",
            }}>
              {t.hero.cta1}
            </Link>
            <Link href="#comment-ca-marche" style={{
              backgroundColor: "white", color: "#1B4F72", fontWeight: 600,
              fontSize: "1rem", padding: "15px 36px", borderRadius: "12px",
              border: "1.5px solid #CBD8E8", boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              display: "inline-block",
            }}>
              {t.hero.cta2}
            </Link>
          </div>

          {/* Stats */}
          <div style={{
            marginTop: "52px", backgroundColor: "white", borderRadius: "16px",
            border: "1px solid #F0F0F0", boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            display: "inline-flex", flexWrap: "wrap", justifyContent: "center",
          }}>
            {STATS.map((stat, i) => (
              <div key={stat.key} style={{
                textAlign: "center", padding: "18px 40px",
                borderRight: i < STATS.length - 1 ? "1px solid #F0F0F0" : "none",
              }}>
                <div style={{ color: "#1B4F72", fontWeight: 800, fontSize: "1.5rem", lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div style={{ color: "#999", fontSize: "0.76rem", marginTop: "6px", fontWeight: 500 }}>
                  {t.stats[stat.key]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" style={{ backgroundColor: "white", width: "100%" }}>
        <div style={{ ...inner, paddingTop: "80px", paddingBottom: "80px" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2 style={{ color: "#1A1A2E", fontWeight: 800, fontSize: "clamp(1.7rem, 3vw, 2.4rem)", marginBottom: "10px" }}>
              {t.services.title}
            </h2>
            <p style={{ color: "#888", fontSize: "1rem" }}>{t.services.sub}</p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
          }}>
            {SERVICE_ICONS.map((icon, i) => (
              <div key={i} style={{
                backgroundColor: "#FAFAFA", border: "1px solid #EFEFEF",
                borderRadius: "16px", padding: "28px 16px 22px",
                textAlign: "center", cursor: "pointer",
                position: "relative", overflow: "hidden",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "none"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
              >
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: "3px",
                  backgroundColor: i % 2 === 0 ? "#FF6B35" : "#1B4F72",
                }} />
                <div style={{ fontSize: "2.2rem", marginBottom: "12px" }}>{icon}</div>
                <div style={{ color: "#1A1A2E", fontWeight: 600, fontSize: "0.9rem" }}>
                  {t.services.items[i]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comment ça marche ── */}
      <section id="comment-ca-marche" style={{ backgroundColor: "#F7F9FC", width: "100%" }}>
        <div style={{ ...inner, paddingTop: "80px", paddingBottom: "80px" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <h2 style={{ color: "#1A1A2E", fontWeight: 800, fontSize: "clamp(1.7rem, 3vw, 2.4rem)", marginBottom: "10px" }}>
              {t.how.title}
            </h2>
            <p style={{ color: "#888", fontSize: "1rem" }}>{t.how.sub}</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", position: "relative" }}>
            {/* Connecting line */}
            <div style={{
              position: "absolute", top: "40px",
              left: "calc(16.66% + 26px)", right: "calc(16.66% + 26px)",
              height: "2px", backgroundColor: "#E8EEF5", zIndex: 0,
            }} />

            {t.how.steps.map((step, i) => (
              <div key={i} style={{
                backgroundColor: "white", borderRadius: "20px",
                padding: "36px 28px 32px", textAlign: "center",
                boxShadow: "0 2px 20px rgba(0,0,0,0.05)",
                border: "1px solid #EEF2F7", position: "relative", zIndex: 1,
              }}>
                <div style={{
                  background: "linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)",
                  color: "white", width: "52px", height: "52px", borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 800, fontSize: "1.3rem", margin: "0 auto 20px",
                  boxShadow: "0 4px 12px rgba(255,107,53,0.3)",
                }}>
                  {i + 1}
                </div>
                <h3 style={{ color: "#1A1A2E", fontWeight: 700, fontSize: "1.05rem", marginBottom: "10px" }}>
                  {step.title}
                </h3>
                <p style={{ color: "#888", lineHeight: 1.7, fontSize: "0.9rem" }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Prestataire ── */}
      <section id="prestataires" style={{
        background: "linear-gradient(135deg, #1B4F72 0%, #16406E 100%)",
        width: "100%", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "200px", height: "200px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.04)" }} />
        <div style={{ position: "absolute", bottom: "-40px", left: "-40px", width: "150px", height: "150px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.04)" }} />

        <div style={{ ...inner, maxWidth: "720px", paddingTop: "80px", paddingBottom: "80px", textAlign: "center", position: "relative", zIndex: 1 }}>
          <h2 style={{ color: "white", fontWeight: 800, fontSize: "clamp(1.7rem, 3vw, 2.5rem)", marginBottom: "16px", lineHeight: 1.2 }}>
            {t.provider.title}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "1.05rem", lineHeight: 1.75, marginBottom: "36px" }}>
            {t.provider.sub}
          </p>
          <Link href="/register" style={{
            backgroundColor: "#FF6B35", color: "white", fontWeight: 700,
            fontSize: "1rem", padding: "15px 40px", borderRadius: "12px",
            display: "inline-block", boxShadow: "0 4px 20px rgba(255,107,53,0.4)",
          }}>
            {t.provider.cta}
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ backgroundColor: "#111827", width: "100%" }}>
        <div style={{ ...inner, paddingTop: "40px", paddingBottom: "40px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "24px" }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: "1.1rem" }}>
                <span style={{ color: "#FF6B35" }}>jari</span>
                <span style={{ color: "white" }}>app</span>
              </div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", marginTop: "4px" }}>
                {t.footer.tagline}
              </div>
            </div>

            <div style={{ display: "flex", gap: "24px" }}>
              {t.footer.links.map((link) => (
                <Link key={link} href="#" style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", fontWeight: 500 }}>
                  {link}
                </Link>
              ))}
            </div>

            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.8rem" }}>
              {t.footer.rights}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
