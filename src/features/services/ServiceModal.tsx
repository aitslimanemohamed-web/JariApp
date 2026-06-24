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

interface CategoryItem { slug: string; icon: string; label: string; }

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

// Construit une annonce locale (sans backend) pour l'affichage immédiat
function buildLocalAnnonce(
  mode: Mode,
  category: CategoryItem,
  titre: string,
  description: string,
  wilaya: { id: number; name: string },
  user: { id: string; firstName: string; lastName: string; username: string },
  date: string,
  dateFlexible: boolean,
): Annonce {
  return {
    id:          crypto.randomUUID(),
    type:        mode === "proposer" ? "SERVICE" : "DEMANDE",
    status:      "ACTIVE",
    titre,
    description,
    wilayaId:    wilaya.id,
    wilayaName:  wilaya.name,
    details:     (mode === "demander"
      ? { date_souhaitee: dateFlexible ? null : (date || null), date_flexible: dateFlexible }
      : { disponibilite: "IMMEDIATE" as const }),
    viewsCount:  0,
    createdAt:   new Date().toISOString(),
    updatedAt:   new Date().toISOString(),
    user:        { id: user.id, firstName: user.firstName, lastName: user.lastName, username: user.username },
    category:    { id: category.slug, slug: category.slug, nameFr: category.label, nameAr: category.label, nameEn: category.label, icon: category.icon },
  };
}

export default function ServiceModal({ initialMode, onClose, onSuccess }: Props) {
  const { t, lang, dir } = useLanguage();
  const { token, user } = useAuth();
  const m = t.feed.modal;

  const [mode, setMode]           = useState<Mode>(initialMode);
  const [search, setSearch]       = useState("");
  const [catOpen, setCatOpen]     = useState(false);
  const [category, setCategory]   = useState<CategoryItem | null>(null);
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
  const searchRef  = useRef<HTMLInputElement>(null);

  const catLabels = t.services.items;
  const categories: CategoryItem[] = CATEGORIES_META.map((c, i) => ({
    ...c, label: catLabels[i] ?? c.slug,
  }));

  const filteredCats = search.trim()
    ? categories.filter(c => c.label.toLowerCase().includes(search.toLowerCase()))
    : categories;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => { setDate(""); setDateFlexible(false); }, [mode]);

  const handleSelectCat = useCallback((cat: CategoryItem) => {
    setCategory(cat);
    setSearch("");
    setCatOpen(false);
  }, []);

  const clearCat = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCategory(null);
    setSearch("");
    setTimeout(() => searchRef.current?.focus(), 50);
  };

  const canSubmit = !!category && titre.trim().length >= 5 && desc.trim().length >= 10 && !!wilaya;

  const handleSubmit = async () => {
    if (!canSubmit || submitting || !user) return;
    setSubmitting(true);
    setError("");

    const payload = {
      type:        (mode === "proposer" ? "SERVICE" : "DEMANDE") as "SERVICE" | "DEMANDE",
      titre:       titre.trim(),
      description: desc.trim(),
      wilayaId:    wilaya!.id,
      wilayaName:  wilaya!.name,
      details:     mode === "demander"
        ? { date_souhaitee: dateFlexible ? null : (date || null), date_flexible: dateFlexible }
        : {},
    };

    if (token) {
      try {
        // Sauvegarde en base de données
        const saved = await api.annonces.create(payload, token);
        setSuccess(true);
        onSuccess(saved);
        setSubmitting(false);
        setTimeout(onClose, 1400);
        return;
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "";
        // Si backend injoignable, on publie quand même localement avec avertissement
        if (msg.includes("Failed to fetch") || msg.includes("NetworkError") || msg.includes("fetch")) {
          setError("⚠️ Serveur hors ligne — l'annonce s'affiche localement mais ne sera pas sauvegardée.");
        } else {
          setError(msg || "Erreur lors de la publication.");
          setSubmitting(false);
          return; // Erreur API réelle (400, 500) → ne pas publier
        }
      }
    }

    // Pas de token ou backend hors ligne → publication locale uniquement
    const local = buildLocalAnnonce(mode, category!, titre.trim(), desc.trim(), wilaya!, user, date, dateFlexible);
    setSuccess(true);
    onSuccess(local);
    setSubmitting(false);
    setTimeout(onClose, 1400);
  };

  if (success) {
    return (
      <div style={{
        position: "fixed", inset: 0, zIndex: 500,
        backgroundColor: "rgba(15,23,42,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{
          backgroundColor: "white", borderRadius: "20px",
          padding: "48px 40px", textAlign: "center",
          boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
          animation: "fadeIn 0.2s ease",
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>✅</div>
          <div style={{ color: "#0F172A", fontWeight: 800, fontSize: "1.1rem" }}>{m.successTitle}</div>
          <div style={{ color: "#64748B", fontSize: "0.85rem", marginTop: "6px" }}>{m.successSub}</div>
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
        boxShadow: "0 20px 60px rgba(0,0,0,0.18)", overflow: "hidden",
      }}>

        {/* ── Header ── */}
        <div style={{ padding: "20px 24px 0", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <span style={{ color: "#0F172A", fontWeight: 800, fontSize: "1rem" }}>{m.title}</span>
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
            {(["proposer", "demander"] as Mode[]).map(mv => (
              <button key={mv} onClick={() => setMode(mv)} style={{
                padding: "9px", borderRadius: "9px", border: "none", cursor: "pointer",
                backgroundColor: mode === mv ? "white" : "transparent",
                color: mode === mv ? "#FF6B35" : "#64748B",
                fontWeight: mode === mv ? 700 : 500, fontSize: "0.88rem",
                boxShadow: mode === mv ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.15s",
              }}>
                {mv === "proposer" ? m.modeProposer : m.modeDemander}
              </button>
            ))}
          </div>
        </div>

        {/* ── Corps scrollable ── */}
        <div style={{ overflowY: "auto", padding: "0 24px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* ── Catégorie ── */}
          <div ref={catRef} style={{ position: "relative" }}>
            <label style={{ display: "block", color: "#334155", fontWeight: 600, fontSize: "0.82rem", marginBottom: "6px" }}>
              {m.categoryLabel} *
            </label>

            {/* Affichage sélection ou champ de recherche */}
            {category ? (
              // Pill sélectionnée — lecture seule
              <div style={{
                ...inputStyle, display: "flex", alignItems: "center", gap: "10px",
                backgroundColor: "#FFF0EB", border: "1.5px solid #FF6B35",
                cursor: "default",
              }}>
                <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>{category.icon}</span>
                <span style={{ flex: 1, color: "#FF6B35", fontWeight: 600 }}>{category.label}</span>
                <button onClick={clearCat} style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "#FF6B35", fontSize: "1rem", lineHeight: 1, padding: "0 2px",
                  flexShrink: 0,
                }}>×</button>
              </div>
            ) : (
              // Champ de recherche
              <div style={{ position: "relative" }}>
                <input
                  ref={searchRef}
                  value={search}
                  onChange={e => { setSearch(e.target.value); setCatOpen(true); }}
                  onFocus={() => setCatOpen(true)}
                  placeholder={m.categoryPlaceholder}
                  style={{ ...inputStyle, paddingRight: "32px" }}
                  autoComplete="off"
                  dir={dir}
                  lang={lang}
                />
                <span style={{
                  position: "absolute", right: "12px", top: "50%",
                  transform: `translateY(-50%) rotate(${catOpen ? "180deg" : "0"})`,
                  color: "#94A3B8", fontSize: "0.65rem",
                  pointerEvents: "none", transition: "transform 0.15s",
                }}>▼</span>
              </div>
            )}

            {/* Dropdown */}
            {catOpen && !category && (
              <div style={{
                position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
                backgroundColor: "white", borderRadius: "12px",
                border: "1.5px solid #EEF0F4",
                boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
                zIndex: 10, maxHeight: "200px", overflowY: "auto",
              }}>
                {filteredCats.length === 0 ? (
                  <div style={{ padding: "12px 16px", color: "#94A3B8", fontSize: "0.85rem" }}>
                    {m.categoryNotFound}
                  </div>
                ) : filteredCats.map(cat => (
                  <button key={cat.slug} onMouseDown={() => handleSelectCat(cat)} style={{
                    width: "100%", display: "flex", alignItems: "center", gap: "12px",
                    padding: "10px 16px", border: "none", backgroundColor: "transparent",
                    cursor: "pointer", textAlign: "left",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
                  >
                    <span style={{ fontSize: "1.1rem", width: "24px", textAlign: "center", flexShrink: 0 }}>{cat.icon}</span>
                    <span style={{ color: "#334155", fontSize: "0.88rem" }}>{cat.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Titre ── */}
          <div>
            <label style={{ display: "block", color: "#334155", fontWeight: 600, fontSize: "0.82rem", marginBottom: "6px" }}>
              {mode === "proposer" ? m.titreProposer : m.titreDemander} *
            </label>
            <input
              value={titre}
              onChange={e => setTitre(e.target.value)}
              placeholder={mode === "proposer" ? m.placeholderTitreProposer : m.placeholderTitreDemander}
              style={inputStyle}
              dir="auto"
              lang={lang}
            />
          </div>

          {/* ── Description ── */}
          <div>
            <label style={{ display: "block", color: "#334155", fontWeight: 600, fontSize: "0.82rem", marginBottom: "6px" }}>
              {m.descLabel} *
            </label>
            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder={mode === "proposer" ? m.placeholderDescProposer : m.placeholderDescDemander}
              rows={3}
              style={{ ...inputStyle, resize: "none", lineHeight: 1.6 }}
              dir="auto"
              lang={lang}
            />
            <div style={{ textAlign: dir === "rtl" ? "left" : "right", color: desc.length >= 10 ? "#10B981" : "#94A3B8", fontSize: "0.7rem", marginTop: "4px" }}>
              {desc.length} / 10 {m.charMin}
            </div>
          </div>

          {/* ── Wilaya ── */}
          <div>
            <label style={{ display: "block", color: "#334155", fontWeight: 600, fontSize: "0.82rem", marginBottom: "6px" }}>
              {m.wilayaLabel} *
            </label>
            <select
              value={wilaya?.id ?? ""}
              onChange={e => {
                const found = WILAYAS.find(w => w.id === Number(e.target.value));
                setWilaya(found ?? null);
              }}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              <option value="">{m.wilayaPlaceholder}</option>
              {WILAYAS.map(w => (
                <option key={w.id} value={w.id}>
                  {w.id.toString().padStart(2, "0")} — {w.name}
                </option>
              ))}
            </select>
          </div>

          {/* ── Date souhaitée (demande uniquement) ── */}
          {mode === "demander" && (
            <div>
              <label style={{ display: "block", color: "#334155", fontWeight: 600, fontSize: "0.82rem", marginBottom: "6px" }}>
                {m.dateLabel}
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
                <input type="checkbox" checked={dateFlexible} onChange={e => setDateFlexible(e.target.checked)}
                  style={{ width: "15px", height: "15px", accentColor: "#FF6B35", cursor: "pointer" }} />
                <span style={{ color: "#64748B", fontSize: "0.82rem" }}>{m.dateFlexible}</span>
              </label>
            </div>
          )}

          {/* ── Erreur ── */}
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
              width: "100%", padding: "13px", borderRadius: "12px", border: "none",
              cursor: canSubmit && !submitting ? "pointer" : "not-allowed",
              background: canSubmit ? "linear-gradient(135deg, #FF6B35, #FF5520)" : "#E5E5E5",
              color: canSubmit ? "white" : "#94A3B8",
              fontWeight: 700, fontSize: "0.95rem",
              boxShadow: canSubmit ? "0 4px 14px rgba(255,107,53,0.35)" : "none",
              transition: "all 0.15s",
            }}
          >
            {submitting ? m.publishing : mode === "proposer" ? m.submitProposer : m.submitDemander}
          </button>
        </div>
      </div>
    </div>
  );
}
