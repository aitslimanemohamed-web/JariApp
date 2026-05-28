"use client";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
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
  );
}
