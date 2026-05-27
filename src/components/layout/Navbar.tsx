"use client";
import Link from "next/link";
import { useLanguage, type Lang } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

const LANGS: { code: Lang; label: string }[] = [
  { code: "fr", label: "FR" },
  { code: "ar", label: "ع" },
  { code: "en", label: "EN" },
];

export default function Navbar() {
  const { t, lang, setLang, dir } = useLanguage();
  const { user, logout } = useAuth();

  return (
    <nav dir={dir} style={{
      backgroundColor: "white",
      borderBottom: "1px solid #F0F0F0",
      position: "sticky", top: 0, zIndex: 100,
      boxShadow: "0 1px 12px rgba(0,0,0,0.06)",
    }}>
      <div style={{
        maxWidth: "1152px", margin: "0 auto",
        padding: "0 20px", height: "64px",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px",
      }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "1px", flexShrink: 0 }}>
          <span style={{
            background: "linear-gradient(135deg, #FF6B35, #FF8C5A)",
            color: "white", fontWeight: 900,
            fontSize: "1.3rem", padding: "4px 11px",
            borderRadius: "10px", letterSpacing: "-0.5px",
            boxShadow: "0 2px 8px rgba(255,107,53,0.3)",
          }}>jari</span>
          <span style={{ color: "#1B4F72", fontWeight: 800, fontSize: "1.3rem", letterSpacing: "-0.5px" }}>app</span>
        </Link>

        {/* Nav links — desktop */}
        <div style={{ display: "flex", alignItems: "center", gap: "28px", flex: 1, justifyContent: "center" }} className="hidden lg:flex">
          {[
            { href: "#services", label: t.nav.services },
            { href: "#comment-ca-marche", label: t.nav.howItWorks },
            { href: "#prestataires", label: t.nav.becomeProvider },
          ].map((link) => (
            <Link key={link.href} href={link.href} style={{
              color: "#555", fontWeight: 500, fontSize: "0.92rem",
              textDecoration: "none", transition: "color 0.15s",
            }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#FF6B35"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#555"}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>

          {/* Lang switcher */}
          <div style={{
            backgroundColor: "#F4F4F4", borderRadius: "10px",
            padding: "3px", display: "flex", gap: "2px",
          }}>
            {LANGS.map(({ code, label }) => (
              <button key={code} onClick={() => setLang(code)} style={{
                backgroundColor: lang === code ? "white" : "transparent",
                color: lang === code ? "#1B4F72" : "#aaa",
                fontWeight: lang === code ? 700 : 500,
                fontSize: "0.78rem", padding: "4px 8px",
                borderRadius: "7px", border: "none", cursor: "pointer",
                boxShadow: lang === code ? "0 1px 4px rgba(0,0,0,0.10)" : "none",
                minWidth: "30px", transition: "all 0.15s",
              }}>
                {label}
              </button>
            ))}
          </div>

          {/* Auth */}
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: "8px",
                backgroundColor: "#FFF4F0", borderRadius: "10px", padding: "6px 12px",
              }}>
                <div style={{
                  width: "28px", height: "28px", borderRadius: "50%",
                  background: "linear-gradient(135deg, #FF6B35, #FF8C5A)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "white", fontWeight: 700, fontSize: "0.8rem", flexShrink: 0,
                }}>
                  {user.firstName.charAt(0).toUpperCase()}
                </div>
                <span style={{ color: "#FF6B35", fontWeight: 600, fontSize: "0.88rem", whiteSpace: "nowrap" }}>
                  {user.firstName}
                </span>
              </div>
              <button onClick={logout} style={{
                color: "#777", fontWeight: 600, fontSize: "0.85rem",
                padding: "7px 14px", borderRadius: "9px",
                border: "1.5px solid #E5E5E5", backgroundColor: "white",
                cursor: "pointer", whiteSpace: "nowrap",
                transition: "border-color 0.15s",
              }}>
                {t.nav.logout}
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Link href="/login" style={{
                color: "#1B4F72", fontWeight: 600, fontSize: "0.88rem",
                padding: "8px 16px", borderRadius: "9px",
                border: "1.5px solid #1B4F72", textDecoration: "none",
                whiteSpace: "nowrap", transition: "background 0.15s",
              }}>
                {t.nav.login}
              </Link>
              <Link href="/register" style={{
                background: "linear-gradient(135deg, #FF6B35, #FF5520)",
                color: "white", fontWeight: 600, fontSize: "0.88rem",
                padding: "8px 16px", borderRadius: "9px",
                textDecoration: "none", whiteSpace: "nowrap",
                boxShadow: "0 2px 8px rgba(255,107,53,0.35)",
              }}>
                {t.nav.register}
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
