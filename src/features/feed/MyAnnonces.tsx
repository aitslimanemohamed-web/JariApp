"use client";
import { useEffect, useState } from "react";
import { api, type Annonce as ApiAnnonce } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  newAnnonces?: ApiAnnonce[];
}

const TYPE_COLOR: Record<string, string> = {
  SERVICE:  "#FF6B35",
  DEMANDE:  "#10B981",
  VENTE:    "#1B4F72",
  EMPLOI:   "#7C3AED",
  LOCATION: "#D97706",
};

const TYPE_ICON: Record<string, string> = {
  SERVICE: "🔧", DEMANDE: "🔍", VENTE: "🏷️", EMPLOI: "💼", LOCATION: "🔑",
};

export default function MyAnnonces({ newAnnonces = [] }: Props) {
  const { t } = useLanguage();
  const { token } = useAuth();
  const [dbAnnonces, setDbAnnonces] = useState<ApiAnnonce[]>([]);

  useEffect(() => {
    if (!token) return;
    api.annonces.me(token)
      .then(data => setDbAnnonces(data))
      .catch(() => {}); // pas de connexion DB → rien à afficher
  }, [token]);

  // Fusion : nouvelles (optimistes) + DB, sans doublons
  const dbIds    = new Set(dbAnnonces.map(a => a.id));
  const freshNew = newAnnonces.filter(a => !dbIds.has(a.id));
  const combined = [...freshNew, ...dbAnnonces];

  if (combined.length === 0) return null;

  return (
    <div style={{ marginBottom: "32px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
        <h2 style={{ color: "#0F172A", fontWeight: 800, fontSize: "1rem", letterSpacing: "-0.3px" }}>
          {t.feed.myAnnonces}
        </h2>
        <span style={{ color: "#94A3B8", fontSize: "0.78rem" }}>
          {combined.length} annonce{combined.length > 1 ? "s" : ""}
        </span>
      </div>

      <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "8px" }}>
        {combined.map(ann => {
          const color = TYPE_COLOR[ann.type] ?? "#64748B";
          const icon  = ann.category?.icon ?? TYPE_ICON[ann.type] ?? "📌";
          const label = ann.category?.nameFr ?? ann.type;

          return (
            <div key={ann.id} style={{
              minWidth: "220px", maxWidth: "260px", backgroundColor: "white",
              borderRadius: "14px", border: `1.5px solid ${color}33`,
              padding: "14px", flexShrink: 0,
              position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", backgroundColor: color }} />
              <div style={{ marginTop: "6px" }}>
                <span style={{ fontSize: "0.7rem", color, fontWeight: 700 }}>{icon} {label}</span>
                <div style={{
                  color: "#0F172A", fontWeight: 700, fontSize: "0.84rem",
                  marginTop: "4px", marginBottom: "8px", lineHeight: 1.3,
                  display: "-webkit-box", WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical", overflow: "hidden",
                }}>
                  {ann.titre}
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{
                    color: "#10B981", fontSize: "0.7rem", fontWeight: 700,
                    backgroundColor: "#ECFDF5", padding: "2px 8px", borderRadius: "100px",
                  }}>
                    ● {t.feed.active}
                  </span>
                  <span style={{ color: "#94A3B8", fontSize: "0.7rem" }}>{ann.wilayaName}</span>
                </div>
              </div>
            </div>
          );
        })}

        <div style={{
          minWidth: "100px", borderRadius: "14px",
          border: "2px dashed #E5E5E5", backgroundColor: "#FAFAFA",
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", gap: "6px", cursor: "pointer", flexShrink: 0, padding: "14px",
        }}>
          <span style={{ color: "#CBD5E1", fontSize: "1.4rem", fontWeight: 300 }}>+</span>
          <span style={{ color: "#94A3B8", fontSize: "0.72rem", fontWeight: 600, textAlign: "center" }}>
            {t.feed.newAnnonce}
          </span>
        </div>
      </div>
    </div>
  );
}
