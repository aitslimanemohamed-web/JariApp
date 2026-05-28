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
const TRUST_KEYS  = ["verified", "fast", "free"] as const;
const TRUST_COLORS = ["#10B981", "#F59E0B", "#6366F1"];

export default function HomePage() {
  const { t, dir } = useLanguage();
  const { user } = useAuth();

  return (
    <div dir={dir} style={{ width: "100%", minHeight: "100vh", backgroundColor: "#FAFAFA" }}>
      <Navbar />

      {/* ══════════════════════════════
          HERO
      ══════════════════════════════ */}
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

          {/* Stats */}
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

      {/* ══════════════════════════════
          WHY US
      ══════════════════════════════ */}
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

      {/* ══════════════════════════════
          SERVICES
      ══════════════════════════════ */}
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

      {/* ══════════════════════════════
          HOW IT WORKS
      ══════════════════════════════ */}
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
                  background: i === 0
                    ? "linear-gradient(135deg, #FF6B35, #FF8C5A)"
                    : i === 1
                      ? "linear-gradient(135deg, #1B4F72, #2E6CA0)"
                      : "linear-gradient(135deg, #10B981, #34D399)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "white", fontWeight: 900, fontSize: "1.3rem",
                  boxShadow: i === 0
                    ? "0 5px 14px rgba(255,107,53,0.35)"
                    : i === 1
                      ? "0 5px 14px rgba(27,79,114,0.3)"
                      : "0 5px 14px rgba(16,185,129,0.3)",
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

      {/* ══════════════════════════════
          TESTIMONIALS
      ══════════════════════════════ */}
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
                <div style={{ color: "#F59E0B", fontSize: "0.85rem", marginBottom: "12px", letterSpacing: "2px" }}>★★★★★</div>
                <p style={{ color: "#334155", lineHeight: 1.7, fontSize: "0.875rem", marginBottom: "18px", fontStyle: "italic" }}>
                  "{item.text}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{
                    width: "38px", height: "38px", borderRadius: "50%", flexShrink: 0,
                    background: i === 0
                      ? "linear-gradient(135deg, #FF6B35, #FF8C5A)"
                      : i === 1
                        ? "linear-gradient(135deg, #6366F1, #818CF8)"
                        : "linear-gradient(135deg, #10B981, #34D399)",
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

      {/* ══════════════════════════════
          PROVIDER CTA
      ══════════════════════════════ */}
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
            color: "rgba(255,255,255,0.7)", fontSize: "clamp(0.9rem, 2vw, 1rem)",
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

      {/* ══════════════════════════════
          FOOTER
      ══════════════════════════════ */}
      <footer style={{ backgroundColor: "#0B1120" }}>
        <div className="jari-wrap">
          <div className="jari-footer-inner">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "1px", marginBottom: "6px" }}>
                <span style={{
                  background: "linear-gradient(135deg, #FF6B35, #FF8C5A)",
                  color: "white", fontWeight: 900, fontSize: "1.05rem",
                  padding: "2px 9px", borderRadius: "7px",
                }}>jari</span>
                <span style={{ color: "white", fontWeight: 800, fontSize: "1.05rem" }}>app</span>
              </div>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.76rem" }}>{t.footer.tagline}</div>
            </div>
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              {t.footer.links.map((link) => (
                <Link key={link} href="#" style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", fontWeight: 500 }}>
                  {link}
                </Link>
              ))}
            </div>
            <div style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.76rem" }}>{t.footer.rights}</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
