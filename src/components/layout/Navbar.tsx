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
  const { t, lang, setLang } = useLanguage();
  const { user, logout } = useAuth();

  return (
    <nav style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #EBEBEB", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
      <div style={{ maxWidth: "1152px", margin: "0 auto", padding: "0 16px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>

        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "2px", textDecoration: "none", flexShrink: 0 }}>
          <span style={{
            backgroundColor: "#FF6B35", color: "white", fontWeight: 800,
            fontSize: "1.25rem", padding: "2px 10px", borderRadius: "8px", letterSpacing: "-0.5px",
          }}>jari</span>
          <span style={{ color: "#1B4F72", fontWeight: 700, fontSize: "1.25rem", letterSpacing: "-0.5px" }}>app</span>
        </Link>

        {/* Nav links — desktop only */}
        <div style={{ display: "flex", alignItems: "center", gap: "24px", flex: 1, justifyContent: "center" }} className="hidden lg:flex">
          {[
            { href: "#services", label: t.nav.services },
            { href: "#comment-ca-marche", label: t.nav.howItWorks },
            { href: "#prestataires", label: t.nav.becomeProvider },
          ].map((link) => (
            <Link key={link.href} href={link.href} style={{ color: "#555", fontWeight: 500, fontSize: "0.9rem", textDecoration: "none" }}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>

          {/* Language switcher */}
          <div style={{ backgroundColor: "#F5F5F5", borderRadius: "8px", padding: "2px", display: "flex", gap: "1px" }}>
            {LANGS.map(({ code, label }) => (
              <button key={code} onClick={() => setLang(code)} style={{
                backgroundColor: lang === code ? "white" : "transparent",
                color: lang === code ? "#1B4F72" : "#999",
                fontWeight: lang === code ? 700 : 500,
                fontSize: "0.75rem", padding: "3px 7px", borderRadius: "6px",
                border: "none", cursor: "pointer",
                boxShadow: lang === code ? "0 1px 3px rgba(0,0,0,0.10)" : "none",
                minWidth: "28px",
              }}>
                {label}
              </button>
            ))}
          </div>

          {/* Auth */}
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: "6px",
                backgroundColor: "#FFF0EB", borderRadius: "8px", padding: "5px 10px",
              }}>
                <div style={{
                  width: "24px", height: "24px", borderRadius: "50%",
                  backgroundColor: "#FF6B35", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  color: "white", fontWeight: 700, fontSize: "0.75rem", flexShrink: 0,
                }}>
                  {user.firstName.charAt(0).toUpperCase()}
                </div>
                <span style={{ color: "#FF6B35", fontWeight: 600, fontSize: "0.85rem", whiteSpace: "nowrap" }}>
                  {user.firstName}
                </span>
              </div>
              <button onClick={logout} style={{
                color: "#888", fontWeight: 600, fontSize: "0.82rem",
                padding: "6px 12px", borderRadius: "8px",
                border: "1.5px solid #E5E5E5", backgroundColor: "white", cursor: "pointer",
                whiteSpace: "nowrap",
              }}>
                {t.nav.logout}
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Link href="/login" style={{
                color: "#1B4F72", fontWeight: 600, fontSize: "0.85rem",
                padding: "7px 14px", borderRadius: "8px",
                border: "1.5px solid #1B4F72", textDecoration: "none",
                whiteSpace: "nowrap",
              }}>
                {t.nav.login}
              </Link>
              <Link href="/register" style={{
                backgroundColor: "#FF6B35", color: "white",
                fontWeight: 600, fontSize: "0.85rem",
                padding: "7px 14px", borderRadius: "8px",
                textDecoration: "none", whiteSpace: "nowrap",
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
