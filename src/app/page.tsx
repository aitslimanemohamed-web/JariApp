"use client";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

const SERVICES = [
  { icon: "🔧", color: "#FF6B35" },
  { icon: "⚡", color: "#F59E0B" },
  { icon: "🧹", color: "#10B981" },
  { icon: "📚", color: "#6366F1" },
  { icon: "🎨", color: "#EC4899" },
  { icon: "❄️", color: "#0EA5E9" },
  { icon: "🚗", color: "#8B5CF6" },
  { icon: "📦", color: "#1B4F72" },
];

const STATS = [
  { value: "500+", key: "providers" as const, icon: "👷" },
  { value: "48",   key: "cities"    as const, icon: "📍" },
  { value: "4.8★", key: "rating"   as const, icon: "⭐" },
];

const TRUST_ICONS = ["✓", "⚡", "🆓"];
const TRUST_KEYS = ["verified", "fast", "free"] as const;
const TRUST_COLORS = ["#10B981", "#F59E0B", "#6366F1"];

const wrap: React.CSSProperties = {
  maxWidth: "1100px", margin: "0 auto",
  padding: "0 20px", width: "100%", boxSizing: "border-box",
};

export default function HomePage() {
  const { t, dir } = useLanguage();
  const { user } = useAuth();

  return (
    <div dir={dir} style={{ width: "100%", minHeight: "100vh", backgroundColor: "#FAFAFA", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <Navbar />

      {/* ═══════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════ */}
      <section style={{
        background: "linear-gradient(150deg, #fff 0%, #FFF8F5 50%, #FFF3EE 100%)",
        width: "100%", borderBottom: "1px solid #F0EBE8",
      }}>
        <div style={{ ...wrap, paddingTop: "80px", paddingBottom: "80px", textAlign: "center" }}>

          {/* Badge */}
          <div style={{ marginBottom: "24px" }}>
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

          {/* Title */}
          <h1 style={{
            color: "#0F172A", fontWeight: 900,
            fontSize: "clamp(2rem, 5.5vw, 3.75rem)",
            lineHeight: 1.1, margin: "0 auto 20px",
            maxWidth: "780px", letterSpacing: "-1px",
          }}>
            {t.hero.line1}{" "}
            <span style={{
              color: "#FF6B35",
              backgroundImage: "linear-gradient(135deg, #FF6B35, #FF8C5A)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              {t.hero.highlight}
            </span>{" "}
            {t.hero.line2}
          </h1>

          {/* Subtitle */}
          <p style={{
            color: "#64748B", fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
            lineHeight: 1.8, maxWidth: "540px", margin: "0 auto 36px",
          }}>
            {t.hero.sub}
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginBottom: "20px" }}>
            <Link href={user ? "#services" : "/register"} style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "linear-gradient(135deg, #FF6B35, #FF5520)",
              color: "white", fontWeight: 700, fontSize: "1rem",
              padding: "14px 32px", borderRadius: "14px",
              boxShadow: "0 4px 20px rgba(255,107,53,0.4)",
              textDecoration: "none", transition: "transform 0.15s",
            }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = "none"}
            >
              {t.hero.cta1}
            </Link>
            <Link href="#comment-ca-marche" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              backgroundColor: "white", color: "#1B4F72", fontWeight: 600, fontSize: "1rem",
              padding: "14px 28px", borderRadius: "14px",
              border: "2px solid #E2E8F0",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              textDecoration: "none", transition: "border-color 0.15s",
            }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "#1B4F72"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "#E2E8F0"}
            >
              {t.hero.cta2}
            </Link>
          </div>

          {/* Login hint */}
          {!user && (
            <p style={{ color: "#94A3B8", fontSize: "0.875rem" }}>
              {t.hero.loginHint}{" "}
              <Link href="/login" style={{ color: "#FF6B35", fontWeight: 600, textDecoration: "none" }}>
                {t.hero.loginLink}
              </Link>
            </p>
          )}

          {/* Stats */}
          <div style={{
            marginTop: "56px",
            display: "inline-flex", flexWrap: "wrap", justifyContent: "center",
            backgroundColor: "white", borderRadius: "20px",
            border: "1px solid #F0EDE8",
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
            overflow: "hidden",
          }}>
            {STATS.map((stat, i) => (
              <div key={stat.key} style={{
                textAlign: "center", padding: "20px 40px",
                borderRight: i < STATS.length - 1 ? "1px solid #F0EDE8" : "none",
              }}>
                <div style={{ fontSize: "1.3rem", marginBottom: "4px" }}>{stat.icon}</div>
                <div style={{ color: "#0F172A", fontWeight: 800, fontSize: "1.6rem", lineHeight: 1, letterSpacing: "-0.5px" }}>
                  {stat.value}
                </div>
                <div style={{ color: "#94A3B8", fontSize: "0.75rem", marginTop: "5px", fontWeight: 500, whiteSpace: "nowrap" }}>
                  {t.stats[stat.key]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          WHY US
      ═══════════════════════════════════════════ */}
      <section style={{ backgroundColor: "white", width: "100%", borderBottom: "1px solid #F0F0F0" }}>
        <div style={{ ...wrap, paddingTop: "72px", paddingBottom: "72px" }}>
          <h2 style={{
            textAlign: "center", color: "#0F172A", fontWeight: 800,
            fontSize: "clamp(1.4rem, 3vw, 2rem)", marginBottom: "40px", letterSpacing: "-0.5px",
          }}>
            {t.trust.title}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
            {TRUST_KEYS.map((key, i) => (
              <div key={key} style={{
                backgroundColor: "#FAFAFA", borderRadius: "16px",
                padding: "28px 24px", border: "1px solid #F0F0F0",
                display: "flex", alignItems: "flex-start", gap: "16px",
              }}>
                <div style={{
                  width: "44px", height: "44px", borderRadius: "12px", flexShrink: 0,
                  backgroundColor: `${TRUST_COLORS[i]}18`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.2rem", color: TRUST_COLORS[i], fontWeight: 700,
                }}>
                  {TRUST_ICONS[i]}
                </div>
                <div>
                  <div style={{ color: "#0F172A", fontWeight: 700, fontSize: "0.95rem", marginBottom: "6px" }}>
                    {t.trust[key].title}
                  </div>
                  <div style={{ color: "#64748B", fontSize: "0.875rem", lineHeight: 1.6 }}>
                    {t.trust[key].desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SERVICES
      ═══════════════════════════════════════════ */}
      <section id="services" style={{ backgroundColor: "#F8FAFC", width: "100%" }}>
        <div style={{ ...wrap, paddingTop: "72px", paddingBottom: "72px" }}>
          <div style={{ textAlign: "center", marginBottom: "44px" }}>
            <h2 style={{ color: "#0F172A", fontWeight: 800, fontSize: "clamp(1.4rem, 3vw, 2rem)", marginBottom: "8px", letterSpacing: "-0.5px" }}>
              {t.services.title}
            </h2>
            <p style={{ color: "#64748B", fontSize: "0.95rem" }}>{t.services.sub}</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "14px" }}>
            {SERVICES.map((svc, i) => (
              <div key={i} style={{
                backgroundColor: "white", borderRadius: "16px",
                padding: "28px 12px 22px", textAlign: "center",
                border: "1px solid #EEF0F4", cursor: "pointer",
                transition: "all 0.2s", position: "relative", overflow: "hidden",
              }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "translateY(-4px)";
                  el.style.boxShadow = `0 12px 32px ${svc.color}22`;
                  el.style.borderColor = `${svc.color}44`;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "none";
                  el.style.boxShadow = "none";
                  el.style.borderColor = "#EEF0F4";
                }}
              >
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: "3px",
                  backgroundColor: svc.color,
                }} />
                <div style={{
                  width: "52px", height: "52px", borderRadius: "14px", margin: "0 auto 12px",
                  backgroundColor: `${svc.color}15`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.7rem",
                }}>
                  {svc.icon}
                </div>
                <div style={{ color: "#1E293B", fontWeight: 600, fontSize: "0.85rem", lineHeight: 1.3 }}>
                  {t.services.items[i]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════════ */}
      <section id="comment-ca-marche" style={{ backgroundColor: "white", width: "100%" }}>
        <div style={{ ...wrap, paddingTop: "72px", paddingBottom: "72px" }}>
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <h2 style={{ color: "#0F172A", fontWeight: 800, fontSize: "clamp(1.4rem, 3vw, 2rem)", marginBottom: "8px", letterSpacing: "-0.5px" }}>
              {t.how.title}
            </h2>
            <p style={{ color: "#64748B", fontSize: "0.95rem" }}>{t.how.sub}</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px" }}>
            {t.how.steps.map((step, i) => (
              <div key={i} style={{
                textAlign: "center", padding: "36px 28px 32px",
                backgroundColor: "#F8FAFC", borderRadius: "20px",
                border: "1px solid #EEF0F4", position: "relative",
              }}>
                <div style={{
                  width: "56px", height: "56px", borderRadius: "18px", margin: "0 auto 20px",
                  background: i === 0
                    ? "linear-gradient(135deg, #FF6B35, #FF8C5A)"
                    : i === 1
                      ? "linear-gradient(135deg, #1B4F72, #2E6CA0)"
                      : "linear-gradient(135deg, #10B981, #34D399)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "white", fontWeight: 900, fontSize: "1.4rem",
                  boxShadow: i === 0
                    ? "0 6px 16px rgba(255,107,53,0.35)"
                    : i === 1
                      ? "0 6px 16px rgba(27,79,114,0.3)"
                      : "0 6px 16px rgba(16,185,129,0.3)",
                }}>
                  {i + 1}
                </div>
                <h3 style={{ color: "#0F172A", fontWeight: 700, fontSize: "1rem", marginBottom: "10px" }}>
                  {step.title}
                </h3>
                <p style={{ color: "#64748B", lineHeight: 1.7, fontSize: "0.875rem" }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════════ */}
      <section style={{ backgroundColor: "#F8FAFC", width: "100%", borderTop: "1px solid #F0F0F0" }}>
        <div style={{ ...wrap, paddingTop: "72px", paddingBottom: "72px" }}>
          <h2 style={{
            textAlign: "center", color: "#0F172A", fontWeight: 800,
            fontSize: "clamp(1.4rem, 3vw, 2rem)", marginBottom: "44px", letterSpacing: "-0.5px",
          }}>
            {t.testimonials.title}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
            {t.testimonials.items.map((item, i) => (
              <div key={i} style={{
                backgroundColor: "white", borderRadius: "18px",
                padding: "28px 24px", border: "1px solid #EEF0F4",
                boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
              }}>
                {/* Stars */}
                <div style={{ color: "#F59E0B", fontSize: "0.9rem", marginBottom: "14px", letterSpacing: "2px" }}>
                  ★★★★★
                </div>
                {/* Quote */}
                <p style={{ color: "#334155", lineHeight: 1.7, fontSize: "0.9rem", marginBottom: "20px", fontStyle: "italic" }}>
                  "{item.text}"
                </p>
                {/* Author */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "50%", flexShrink: 0,
                    background: i === 0
                      ? "linear-gradient(135deg, #FF6B35, #FF8C5A)"
                      : i === 1
                        ? "linear-gradient(135deg, #6366F1, #818CF8)"
                        : "linear-gradient(135deg, #10B981, #34D399)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "white", fontWeight: 700, fontSize: "1rem",
                  }}>
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ color: "#0F172A", fontWeight: 700, fontSize: "0.88rem" }}>{item.name}</div>
                    <div style={{ color: "#94A3B8", fontSize: "0.78rem" }}>{item.role} · {item.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PROVIDER CTA
      ═══════════════════════════════════════════ */}
      <section id="prestataires" style={{
        background: "linear-gradient(135deg, #1A3C5E 0%, #1B4F72 50%, #1E5F8A 100%)",
        width: "100%", position: "relative", overflow: "hidden",
      }}>
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "300px", height: "300px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.04)" }} />
        <div style={{ position: "absolute", bottom: "-60px", left: "-60px", width: "220px", height: "220px", borderRadius: "50%", backgroundColor: "rgba(255,107,53,0.08)" }} />
        <div style={{ position: "absolute", top: "50%", left: "15%", width: "100px", height: "100px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.03)", transform: "translateY(-50%)" }} />

        <div style={{ ...wrap, maxWidth: "700px", paddingTop: "80px", paddingBottom: "80px", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-block", backgroundColor: "rgba(255,107,53,0.2)",
            color: "#FF8C5A", fontWeight: 600, fontSize: "0.8rem",
            padding: "5px 14px", borderRadius: "100px", marginBottom: "20px",
            border: "1px solid rgba(255,107,53,0.3)",
          }}>
            💼 Rejoignez notre réseau
          </div>
          <h2 style={{
            color: "white", fontWeight: 900,
            fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)", marginBottom: "16px", lineHeight: 1.2,
            letterSpacing: "-0.5px",
          }}>
            {t.provider.title}
          </h2>
          <p style={{
            color: "rgba(255,255,255,0.7)", fontSize: "1rem", lineHeight: 1.8, marginBottom: "36px", maxWidth: "500px", margin: "0 auto 36px",
          }}>
            {t.provider.sub}
          </p>
          <Link href="/register" style={{
            display: "inline-block",
            background: "linear-gradient(135deg, #FF6B35, #FF5520)",
            color: "white", fontWeight: 700, fontSize: "1rem",
            padding: "15px 40px", borderRadius: "14px",
            boxShadow: "0 6px 24px rgba(255,107,53,0.5)",
            textDecoration: "none", transition: "transform 0.15s",
          }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = "none"}
          >
            {t.provider.cta}
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════ */}
      <footer style={{ backgroundColor: "#0B1120", width: "100%" }}>
        <div style={{ ...wrap, paddingTop: "40px", paddingBottom: "40px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "20px" }}>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "1px", marginBottom: "6px" }}>
                <span style={{
                  background: "linear-gradient(135deg, #FF6B35, #FF8C5A)",
                  color: "white", fontWeight: 900, fontSize: "1.1rem",
                  padding: "2px 9px", borderRadius: "7px",
                }}>jari</span>
                <span style={{ color: "white", fontWeight: 800, fontSize: "1.1rem" }}>app</span>
              </div>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.78rem" }}>
                {t.footer.tagline}
              </div>
            </div>

            <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
              {t.footer.links.map((link) => (
                <Link key={link} href="#" style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.82rem", fontWeight: 500, textDecoration: "none", transition: "color 0.15s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.8)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)"}
                >
                  {link}
                </Link>
              ))}
            </div>

            <div style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.78rem" }}>
              {t.footer.rights}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
