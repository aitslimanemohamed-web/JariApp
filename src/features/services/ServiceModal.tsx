"use client";
import { useState, useEffect, useRef } from "react";
import { WILAYAS } from "@/lib/wilayas";

type Mode = "proposer" | "demander";

const CATEGORIES = [
  { icon: "🔧", label: "Plomberie" },
  { icon: "⚡", label: "Électricité" },
  { icon: "❄️", label: "Climatisation" },
  { icon: "🚗", label: "Mécanique" },
  { icon: "🧹", label: "Ménage" },
  { icon: "📚", label: "Cours" },
  { icon: "🖌️", label: "Peinture" },
  { icon: "🚖", label: "Chauffeur" },
  { icon: "🧱", label: "Maçonnerie" },
  { icon: "💻", label: "Informatique" },
  { icon: "📦", label: "Déménagement" },
  { icon: "🔌", label: "Électroménager" },
];

const DISPOS = [
  { key: "immediate",  label: "Immédiate",       icon: "⚡" },
  { key: "rdv",        label: "Sur rendez-vous",  icon: "📅" },
  { key: "partiel",    label: "Temps partiel",    icon: "🕐" },
];

interface Props {
  initialMode: Mode;
  onClose: () => void;
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "11px 14px", borderRadius: "10px",
  border: "1.5px solid #E5E5E5", fontSize: "0.88rem",
  outline: "none", color: "#334155", backgroundColor: "white",
  fontFamily: "inherit",
};

export default function ServiceModal({ initialMode, onClose }: Props) {
  const [mode, setMode]       = useState<Mode>(initialMode);
  const [category, setCategory] = useState("");
  const [titre, setTitre]     = useState("");
  const [desc, setDesc]       = useState("");
  const [wilaya, setWilaya]   = useState("");
  const [dispo, setDispo]     = useState("immediate");
  const [date, setDate]       = useState("");
  const [dateFlexible, setDateFlexible] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  // fermeture ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // reset champs spécifiques au changement de mode
  useEffect(() => {
    setDispo("immediate");
    setDate("");
    setDateFlexible(false);
  }, [mode]);

  const canSubmit = category && titre.trim() && desc.trim() && wilaya;

  return (
    <div
      ref={overlayRef}
      onClick={e => { if (e.target === overlayRef.current) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 500,
        backgroundColor: "rgba(15,23,42,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px",
      }}
    >
      <div style={{
        backgroundColor: "white", borderRadius: "20px",
        width: "100%", maxWidth: "520px",
        maxHeight: "90vh", display: "flex", flexDirection: "column",
        boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
        overflow: "hidden",
      }}>

        {/* ── Header ── */}
        <div style={{ padding: "20px 24px 0", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
            <span style={{ color: "#0F172A", fontWeight: 800, fontSize: "1rem" }}>
              Publier une annonce de service
            </span>
            <button onClick={onClose} style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#94A3B8", fontSize: "1.3rem", lineHeight: 1, padding: "2px 6px",
            }}>×</button>
          </div>

          {/* Toggle Proposer / Demander */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            backgroundColor: "#F4F6F8", borderRadius: "12px", padding: "4px",
            marginBottom: "20px",
          }}>
            {(["proposer", "demander"] as Mode[]).map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                padding: "9px", borderRadius: "9px", border: "none", cursor: "pointer",
                backgroundColor: mode === m ? "white" : "transparent",
                color: mode === m ? "#FF6B35" : "#64748B",
                fontWeight: mode === m ? 700 : 500,
                fontSize: "0.88rem",
                boxShadow: mode === m ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.15s",
              }}>
                {m === "proposer" ? "🔧 Proposer" : "🔍 Demander"}
              </button>
            ))}
          </div>
        </div>

        {/* ── Corps scrollable ── */}
        <div style={{ overflowY: "auto", padding: "0 24px 24px", display: "flex", flexDirection: "column", gap: "18px" }}>

          {/* Catégorie */}
          <div>
            <label style={{ display: "block", color: "#334155", fontWeight: 600, fontSize: "0.82rem", marginBottom: "10px" }}>
              Catégorie *
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
              {CATEGORIES.map(cat => {
                const isSelected = category === cat.label;
                return (
                  <button key={cat.label} onClick={() => setCategory(cat.label)} style={{
                    padding: "10px 6px", borderRadius: "10px", cursor: "pointer",
                    backgroundColor: isSelected ? "#FFF0EB" : "#F8FAFC",
                    border: isSelected ? "1.5px solid #FF6B35" : "1.5px solid #EEF0F4",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
                    transition: "all 0.12s",
                  }}>
                    <span style={{ fontSize: "1.3rem" }}>{cat.icon}</span>
                    <span style={{ fontSize: "0.65rem", color: isSelected ? "#FF6B35" : "#64748B", fontWeight: isSelected ? 700 : 500, textAlign: "center" }}>
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Titre */}
          <div>
            <label style={{ display: "block", color: "#334155", fontWeight: 600, fontSize: "0.82rem", marginBottom: "6px" }}>
              {mode === "proposer" ? "Intitulé du service *" : "Ce que vous cherchez *"}
            </label>
            <input
              value={titre}
              onChange={e => setTitre(e.target.value)}
              placeholder={mode === "proposer" ? "Ex : Plombier disponible à Alger" : "Ex : Cherche électricien pour fuite"}
              style={inputStyle}
            />
          </div>

          {/* Description */}
          <div>
            <label style={{ display: "block", color: "#334155", fontWeight: 600, fontSize: "0.82rem", marginBottom: "6px" }}>
              Description *
            </label>
            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder={mode === "proposer"
                ? "Décrivez votre service, votre expérience, zones d'intervention..."
                : "Décrivez votre besoin en détail..."}
              rows={3}
              style={{ ...inputStyle, resize: "none", lineHeight: 1.6 }}
            />
          </div>

          {/* Wilaya */}
          <div>
            <label style={{ display: "block", color: "#334155", fontWeight: 600, fontSize: "0.82rem", marginBottom: "6px" }}>
              Wilaya *
            </label>
            <select value={wilaya} onChange={e => setWilaya(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
              <option value="">Sélectionner votre wilaya</option>
              {WILAYAS.map(w => (
                <option key={w.id} value={w.name}>{w.id.toString().padStart(2, "0")} — {w.name}</option>
              ))}
            </select>
          </div>

          {/* Champ spécifique selon le mode */}
          {mode === "proposer" ? (
            <div>
              <label style={{ display: "block", color: "#334155", fontWeight: 600, fontSize: "0.82rem", marginBottom: "10px" }}>
                Disponibilité
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                {DISPOS.map(d => {
                  const isSelected = dispo === d.key;
                  return (
                    <button key={d.key} onClick={() => setDispo(d.key)} style={{
                      padding: "12px 8px", borderRadius: "10px", cursor: "pointer",
                      backgroundColor: isSelected ? "#FFF0EB" : "#F8FAFC",
                      border: isSelected ? "1.5px solid #FF6B35" : "1.5px solid #EEF0F4",
                      display: "flex", flexDirection: "column", alignItems: "center", gap: "5px",
                      transition: "all 0.12s",
                    }}>
                      <span style={{ fontSize: "1.2rem" }}>{d.icon}</span>
                      <span style={{ fontSize: "0.7rem", color: isSelected ? "#FF6B35" : "#64748B", fontWeight: isSelected ? 700 : 500, textAlign: "center", lineHeight: 1.3 }}>
                        {d.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              <label style={{ display: "block", color: "#334155", fontWeight: 600, fontSize: "0.82rem", marginBottom: "6px" }}>
                Date souhaitée
              </label>
              <input
                type="date"
                value={dateFlexible ? "" : date}
                disabled={dateFlexible}
                onChange={e => setDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                style={{ ...inputStyle, cursor: dateFlexible ? "not-allowed" : "pointer", opacity: dateFlexible ? 0.4 : 1 }}
              />
              <label style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "10px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={dateFlexible}
                  onChange={e => setDateFlexible(e.target.checked)}
                  style={{ width: "15px", height: "15px", accentColor: "#FF6B35", cursor: "pointer" }}
                />
                <span style={{ color: "#64748B", fontSize: "0.82rem" }}>Date flexible / à discuter</span>
              </label>
            </div>
          )}
        </div>

        {/* ── Footer bouton ── */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid #F0F0F0", flexShrink: 0 }}>
          <button
            disabled={!canSubmit}
            style={{
              width: "100%", padding: "13px",
              borderRadius: "12px", border: "none", cursor: canSubmit ? "pointer" : "not-allowed",
              background: canSubmit ? "linear-gradient(135deg, #FF6B35, #FF5520)" : "#E5E5E5",
              color: canSubmit ? "white" : "#94A3B8",
              fontWeight: 700, fontSize: "0.95rem",
              boxShadow: canSubmit ? "0 4px 14px rgba(255,107,53,0.35)" : "none",
              transition: "all 0.15s",
            }}
          >
            {mode === "proposer" ? "Publier mon service" : "Publier ma demande"}
          </button>
        </div>
      </div>
    </div>
  );
}
