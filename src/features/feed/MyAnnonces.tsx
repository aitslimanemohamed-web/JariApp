"use client";
import { type Annonce } from "./FeedCard";

const MOCK_MY: Annonce[] = [
  {
    id: 101, type: "service", category: "Plomberie", categoryIcon: "🔧",
    title: "Plombier disponible à Alger",
    description: "Dépannage rapide, installation, rénovation. Disponible 7j/7.",
    author: "Moi", authorInitial: "M", wilaya: "Alger", price: "2 000 DA/h",
    time: "Actif", isOwn: true,
  },
  {
    id: 102, type: "vente", category: "Informatique", categoryIcon: "💻",
    title: "Laptop Dell Core i5",
    description: "8Go RAM, 256Go SSD. Parfait état, batterie neuve.",
    author: "Moi", authorInitial: "M", wilaya: "Alger", price: "55 000 DA",
    time: "Actif", isOwn: true,
  },
];

const TYPE_COLOR: Record<string, string> = {
  service:  "#FF6B35",
  vente:    "#1B4F72",
  demande:  "#10B981",
  emploi:   "#7C3AED",
  location: "#D97706",
};

export default function MyAnnonces() {
  if (MOCK_MY.length === 0) return null;

  return (
    <div style={{ marginBottom: "32px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
        <h2 style={{ color: "#0F172A", fontWeight: 800, fontSize: "1rem", letterSpacing: "-0.3px" }}>
          Mes annonces actives
        </h2>
        <button style={{
          background: "none", border: "none", cursor: "pointer",
          color: "#FF6B35", fontWeight: 600, fontSize: "0.82rem",
        }}>
          Voir tout →
        </button>
      </div>

      <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "4px" }}>
        {MOCK_MY.map(ann => (
          <div key={ann.id} style={{
            minWidth: "220px", backgroundColor: "white", borderRadius: "14px",
            border: `1.5px solid ${TYPE_COLOR[ann.type]}33`,
            padding: "14px", flexShrink: 0,
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", backgroundColor: TYPE_COLOR[ann.type] }} />
            <div style={{ marginTop: "4px" }}>
              <span style={{ fontSize: "0.7rem", color: TYPE_COLOR[ann.type], fontWeight: 700 }}>
                {ann.categoryIcon} {ann.category}
              </span>
              <div style={{ color: "#0F172A", fontWeight: 700, fontSize: "0.84rem", marginTop: "4px", marginBottom: "6px", lineHeight: 1.3 }}>
                {ann.title}
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ color: "#10B981", fontSize: "0.7rem", fontWeight: 700, backgroundColor: "#ECFDF5", padding: "2px 8px", borderRadius: "100px" }}>
                  ● Actif
                </span>
                <span style={{ color: TYPE_COLOR[ann.type], fontWeight: 700, fontSize: "0.82rem" }}>
                  {ann.price}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* bouton ajouter */}
        <div style={{
          minWidth: "100px", borderRadius: "14px",
          border: "2px dashed #E5E5E5", backgroundColor: "#FAFAFA",
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", gap: "6px", cursor: "pointer", flexShrink: 0, padding: "14px",
        }}>
          <span style={{ color: "#CBD5E1", fontSize: "1.4rem", fontWeight: 300 }}>+</span>
          <span style={{ color: "#94A3B8", fontSize: "0.72rem", fontWeight: 600, textAlign: "center" }}>Nouvelle annonce</span>
        </div>
      </div>
    </div>
  );
}
