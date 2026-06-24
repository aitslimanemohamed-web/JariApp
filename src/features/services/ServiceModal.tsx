"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { WILAYAS } from "@/lib/wilayas";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { api, type Annonce } from "@/lib/api";

type Mode = "proposer" | "demander";

const CATEGORIES_META = [
  { slug: "plomberie",      icon: "🔧" },
  { slug: "electricite",    icon: "⚡" },
  { slug: "climatisation",  icon: "❄️" },
  { slug: "mecanique",      icon: "🚗" },
  { slug: "menage",         icon: "🧹" },
  { slug: "cours",          icon: "📚" },
  { slug: "peinture",       icon: "🖌️" },
  { slug: "chauffeur",      icon: "🚖" },
  { slug: "maconnerie",     icon: "🧱" },
  { slug: "informatique",   icon: "💻" },
  { slug: "demenagement",   icon: "📦" },
  { slug: "electromenager", icon: "🔌" },
];

interface Props {
  initialMode: Mode;
  onClose: () => void;
  onSuccess: (annonce: Annonce) => void;
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "11px 14px", borderRadius: "10px",
  border: "1.5px solid #E5E5E5", fontSize: "0.88rem",
  outline: "none", color: "#334155", backgroundColor: "white",
  fontFamily: "inherit",
};

export default function ServiceModal({ initialMode, onClose, onSuccess }: Props) {
  const { t, lang, dir } = useLanguage();
  const { token } = useAuth();

  const [mode, setMode]           = useState<Mode>(initialMode);
  const [catSearch, setCatSearch] = useState("");
  const [catOpen, setCatOpen]     = useState(false);
  const [category, setCategory]   = useState<{ slug: string; label: string; icon: string } | null>(null);
  const [titre, setTitre]         = useState("");
  const [desc, setDesc]           = useState("");
  const [wilaya, setWilaya]       = useState<{ id: number; name: string } | null>(null);
  const [date, setDate]           = useState("");
  const [dateFlexible, setDateFlexible] = useState(false);
  const [submitting, setSubmitting]     = useState(false);
  const [error, setError]               = useState("");
  const [success, setSuccess]           = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const catRef     = useRef<HTMLDivElement>(null);

  // Libellés catégories selon la langue
  const catLabels = t.services.items; // 12 items alignés sur CATEGORIES_META

  const categoriesWithLabel = CATEGORIES_META.map((c, i) => ({
    ...c,
    label: catLabels[i] ?? c.slug,
  }));

  const filteredCats = catSearch
    ? categoriesWithLabel.filter(c => c.label.toLowerCase().includes(catSearch.toLowerCase()))
    : categoriesWithLabel;

  // Fermeture ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Fermeture combobox au clic dehors
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setDate("");
    setDateFlexible(false);
  }, [mode]);

  const handleSelectCat = useCallback((cat: typeof categoriesWithLabel[0]) => {
    setCategory(cat);
    setCatSearch(cat.label);
    setCatOpen(false);
  }, [categoriesWithLabel]);

  const canSubmit = category && titre.trim().length >= 5 && desc.trim().length >= 10 && wilaya;

  const handleSubmit = async () => {
    if (!canSubmit || !token) return;
    setSubmitting(true);
    setError("");
    try {
      const details = mode === "demander"
        ? { date_souhaitee: dateFlexible ? null : (date || null), date_flexible: dateFlexible }
        : {};

      const annonce = await api.annonces.create({
        type:        mode === "proposer" ? "SERVICE" : "DEMANDE",
        titre:       titre.trim(),
        description: desc.trim(),
        wilayaId:    wilaya!.id,
        wilayaName:  wilaya!.name,
        details,
      }, token);

      setSuccess(true);
      setTimeout(() => { onSuccess(annonce); onClose(); }, 1200);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur lors de la publication");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div style={{
        position: "fixed", inset: 0, zIndex: 500,
        backgroundColor: "rgba(15,23,42,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{
          backgroundColor: "white", borderRadius: "20px", padding: "48px 40px",
          textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>✅</div>
          <div style={{ color: "#0F172A", fontWeight: 800, fontSize: "1.1rem" }}>
            Annonce publiée !
          </div>
          <div style={{ color: "#64748B", fontSize: "0.85rem", marginTop: "6px" }}>
            Elle apparaît maintenant dans le feed.
          </div>
        </div>
      </div>
    );
  }

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
      <div dir={dir} style={{
        backgroundColor: "white", borderRadius: "20px",
        width: "100%", maxWidth: "500px",
        maxHeight: "92vh", display: "flex", flexDirection: "column",
        boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
        overflow: "hidden",
      }}>

        {/* ── Header ── */}
        <div style={{ padding: "20px 24px 0", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <span style={{ color: "#0F172A", fontWeight: 800, fontSize: "1rem" }}>
              Publier une annonce de service
            </span>
            <button onClick={onClose} style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#94A3B8", fontSize: "1.3rem", lineHeight: 1, padding: "2px 8px",
            }}>×</button>
          </div>

          {/* Toggle */}
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
        <div style={{ overflowY: "auto", padding: "0 24px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Catégorie — combobox searchable */}
          <div ref={catRef} style={{ position: "relative" }}>
            <label style={{ display: "block", color: "#334155", fontWeight: 600, fontSize: "0.82rem", marginBottom: "6px" }}>
              Catégorie *
            </label>
            <div style={{ position: "relative" }}>
              <input
                value={catSearch}
                onChange={e => { setCatSearch(e.target.value); setCategory(null); setCatOpen(true); }}
                onFocus={() => setCatOpen(true)}
                placeholder="Rechercher une catégorie..."
                style={{ ...inputStyle, paddingRight: "36px" }}
                dir="auto"
              />
              {category && (
                <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "1rem" }}>
                  {category.icon}
                </span>
              )}
              <span style={{
                position: "absolute", right: "12px", top: "50%",
                transform: `translateY(-50%) rotate(${catOpen ? "180deg" : "0deg"})`,
                color: "#94A3B8", fontSize: "0.7rem", transition: "transform 0.15s",
                pointerEvents: "none",
              }}>▼</span>
            </div>

            {catOpen && (
              <div style={{
                position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
                backgroundColor: "white", borderRadius: "12px",
                border: "1.5px solid #EEF0F4",
                boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
                zIndex: 10, maxHeight: "220px", overflowY: "auto",
              }}>
                {filteredCats.length === 0 ? (
                  <div style={{ padding: "12px 14px", color: "#94A3B8", fontSize: "0.85rem" }}>
                    Aucune catégorie trouvée
                  </div>
                ) : filteredCats.map(cat => (
                  <button key={cat.slug} onMouseDown={() => handleSelectCat(cat)} style={{
                    width: "100%", display: "flex", alignItems: "center", gap: "10px",
                    padding: "10px 14px", border: "none", backgroundColor: "transparent",
                    cursor: "pointer", textAlign: "left", transition: "background 0.1s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
                  >
                    <span style={{ fontSize: "1.1rem", width: "24px", textAlign: "center" }}>{cat.icon}</span>
                    <span style={{ color: "#334155", fontSize: "0.88rem", fontWeight: 500 }}>{cat.label}</span>
                  </button>
                ))}
              </div>
            )}
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
              dir="auto"
              lang={lang}
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
                ? "Décrivez votre service, zones d'intervention, expérience..."
                : "Décrivez votre besoin en détail..."}
              rows={3}
              style={{ ...inputStyle, resize: "none", lineHeight: 1.6 }}
              dir="auto"
              lang={lang}
            />
            <div style={{ textAlign: "right", color: "#94A3B8", fontSize: "0.7rem", marginTop: "4px" }}>
              {desc.length} / 10 min
            </div>
          </div>

          {/* Wilaya */}
          <div>
            <label style={{ display: "block", color: "#334155", fontWeight: 600, fontSize: "0.82rem", marginBottom: "6px" }}>
              Wilaya *
            </label>
            <select
              value={wilaya?.id ?? ""}
              onChange={e => {
                const found = WILAYAS.find(w => w.id === Number(e.target.value));
                setWilaya(found ?? null);
              }}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              <option value="">Sélectionner votre wilaya</option>
              {WILAYAS.map(w => (
                <option key={w.id} value={w.id}>
                  {w.id.toString().padStart(2, "0")} — {w.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date souhaitée — uniquement pour "demander" */}
          {mode === "demander" && (
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

          {/* Erreur */}
          {error && (
            <div style={{
              backgroundColor: "#FFF5F5", border: "1px solid #FED7D7",
              borderRadius: "10px", padding: "10px 14px",
              color: "#C53030", fontSize: "0.82rem",
            }}>
              {error}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid #F0F0F0", flexShrink: 0 }}>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            style={{
              width: "100%", padding: "13px",
              borderRadius: "12px", border: "none",
              cursor: canSubmit && !submitting ? "pointer" : "not-allowed",
              background: canSubmit ? "linear-gradient(135deg, #FF6B35, #FF5520)" : "#E5E5E5",
              color: canSubmit ? "white" : "#94A3B8",
              fontWeight: 700, fontSize: "0.95rem",
              boxShadow: canSubmit ? "0 4px 14px rgba(255,107,53,0.35)" : "none",
              transition: "all 0.15s",
            }}
          >
            {submitting ? "Publication..." : mode === "proposer" ? "Publier mon service" : "Publier ma demande"}
          </button>
        </div>
      </div>
    </div>
  );
}
