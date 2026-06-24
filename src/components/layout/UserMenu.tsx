"use client";
import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

const MENU_ITEMS = [
  { key: "profile",       icon: "👤", href: "/profile" },
  { key: "notifications", icon: "🔔", href: "/notifications", badge: 3 },
  { key: "location",      icon: "📍", href: "/settings/location" },
  { key: "settings",      icon: "⚙️", href: "/settings" },
] as const;

export default function UserMenu() {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!user) return null;

  const initial = user.firstName.charAt(0).toUpperCase();

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Avatar bouton */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", gap: "8px",
          backgroundColor: open ? "#FFF0EB" : "#FFF4F0",
          border: `1.5px solid ${open ? "#FF6B35" : "#FFD8C8"}`,
          borderRadius: "12px", padding: "5px 10px 5px 5px",
          cursor: "pointer", transition: "all 0.15s",
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLButtonElement;
          el.style.borderColor = "#FF6B35";
          el.style.backgroundColor = "#FFF0EB";
        }}
        onMouseLeave={e => {
          if (open) return;
          const el = e.currentTarget as HTMLButtonElement;
          el.style.borderColor = "#FFD8C8";
          el.style.backgroundColor = "#FFF4F0";
        }}
      >
        {/* Avatar cercle */}
        <div style={{
          width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(135deg, #FF6B35, #FF8C5A)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "white", fontWeight: 800, fontSize: "0.78rem",
          boxShadow: "0 2px 6px rgba(255,107,53,0.4)",
        }}>
          {initial}
        </div>
        <span style={{ color: "#FF6B35", fontWeight: 700, fontSize: "0.85rem", whiteSpace: "nowrap" }}>
          {user.firstName}
        </span>
        {/* badge notifs */}
        <div style={{
          width: "7px", height: "7px", borderRadius: "50%",
          backgroundColor: "#EF4444", flexShrink: 0,
        }} />
        {/* chevron */}
        <span style={{
          color: "#FF6B35", fontSize: "0.65rem",
          transform: open ? "rotate(180deg)" : "none",
          transition: "transform 0.2s", flexShrink: 0,
        }}>▼</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", right: 0,
          backgroundColor: "white", borderRadius: "16px",
          border: "1px solid #EEF0F4",
          boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
          minWidth: "220px", zIndex: 200, overflow: "hidden",
        }}>
          {/* Header user */}
          <div style={{
            padding: "16px", borderBottom: "1px solid #F4F6F8",
            background: "linear-gradient(135deg, #FFF8F5, #FFF4F0)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "38px", height: "38px", borderRadius: "50%", flexShrink: 0,
                background: "linear-gradient(135deg, #FF6B35, #FF8C5A)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontWeight: 800, fontSize: "1rem",
                boxShadow: "0 3px 10px rgba(255,107,53,0.35)",
              }}>
                {initial}
              </div>
              <div>
                <div style={{ color: "#0F172A", fontWeight: 700, fontSize: "0.88rem" }}>
                  {user.firstName} {user.lastName}
                </div>
                <div style={{ color: "#94A3B8", fontSize: "0.75rem" }}>@{user.username}</div>
              </div>
            </div>
          </div>

          {/* Items */}
          <div style={{ padding: "6px" }}>
            {MENU_ITEMS.map(item => (
              <button key={item.key} onClick={() => setOpen(false)} style={{
                width: "100%", display: "flex", alignItems: "center", gap: "10px",
                padding: "10px 12px", borderRadius: "10px",
                border: "none", backgroundColor: "transparent", cursor: "pointer",
                transition: "background 0.12s", textAlign: "left",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
              >
                <span style={{ fontSize: "1rem", width: "22px", textAlign: "center" }}>{item.icon}</span>
                <span style={{ color: "#334155", fontWeight: 500, fontSize: "0.85rem", flex: 1 }}>
                  {t.nav.menu[item.key]}
                </span>
                {"badge" in item && (
                  <span style={{
                    backgroundColor: "#EF4444", color: "white",
                    fontWeight: 700, fontSize: "0.65rem",
                    padding: "1px 6px", borderRadius: "100px",
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}

            {/* Séparateur + logout */}
            <div style={{ height: "1px", backgroundColor: "#F0F0F0", margin: "6px 0" }} />
            <button onClick={() => { logout(); setOpen(false); }} style={{
              width: "100%", display: "flex", alignItems: "center", gap: "10px",
              padding: "10px 12px", borderRadius: "10px",
              border: "none", backgroundColor: "transparent", cursor: "pointer",
              transition: "background 0.12s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#FFF5F5"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
            >
              <span style={{ fontSize: "1rem", width: "22px", textAlign: "center" }}>🚪</span>
              <span style={{ color: "#EF4444", fontWeight: 600, fontSize: "0.85rem" }}>
                {t.nav.menu.logout}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
