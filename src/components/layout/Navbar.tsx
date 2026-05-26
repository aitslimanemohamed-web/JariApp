"use client";
import Link from "next/link";
import { useLanguage, type Lang } from "@/contexts/LanguageContext";

const LANGS: { code: Lang; label: string }[] = [
  { code: "fr", label: "FR" },
  { code: "ar", label: "ع" },
  { code: "en", label: "EN" },
];

export default function Navbar() {
  const { t, lang, setLang } = useLanguage();

  return (
    <nav
      style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #EBEBEB" }}
      className="sticky top-0 z-50 shadow-sm"
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 shrink-0">
          <span
            style={{
              backgroundColor: "#FF6B35",
              color: "white",
              fontWeight: 800,
              fontSize: "1.35rem",
              padding: "3px 11px",
              borderRadius: "9px",
              letterSpacing: "-0.5px",
            }}
          >
            jari
          </span>
          <span
            style={{
              color: "#1B4F72",
              fontWeight: 700,
              fontSize: "1.35rem",
              letterSpacing: "-0.5px",
            }}
          >
            app
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden lg:flex items-center gap-7 flex-1 justify-center">
          {[
            { href: "#services", label: t.nav.services },
            { href: "#comment-ca-marche", label: t.nav.howItWorks },
            { href: "#prestataires", label: t.nav.becomeProvider },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{ color: "#444", fontWeight: 500, fontSize: "0.95rem" }}
              className="hover:text-orange-500 transition-colors whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 shrink-0">

          {/* Language switcher */}
          <div
            style={{
              backgroundColor: "#F5F5F5",
              borderRadius: "10px",
              padding: "3px",
              display: "flex",
              gap: "2px",
            }}
          >
            {LANGS.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                style={{
                  backgroundColor: lang === code ? "white" : "transparent",
                  color: lang === code ? "#1B4F72" : "#888",
                  fontWeight: lang === code ? 700 : 500,
                  fontSize: "0.8rem",
                  padding: "4px 9px",
                  borderRadius: "7px",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: lang === code ? "0 1px 4px rgba(0,0,0,0.10)" : "none",
                  transition: "all 0.15s",
                  minWidth: "32px",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Auth buttons */}
          <Link
            href="/login"
            style={{
              color: "#1B4F72",
              fontWeight: 600,
              fontSize: "0.9rem",
              padding: "8px 18px",
              borderRadius: "9px",
              border: "1.5px solid #1B4F72",
            }}
            className="hover:bg-blue-50 transition-colors hidden sm:block whitespace-nowrap"
          >
            {t.nav.login}
          </Link>
          <Link
            href="/register"
            style={{
              backgroundColor: "#FF6B35",
              color: "white",
              fontWeight: 600,
              fontSize: "0.9rem",
              padding: "9px 18px",
              borderRadius: "9px",
            }}
            className="hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            {t.nav.register}
          </Link>
        </div>
      </div>
    </nav>
  );
}
