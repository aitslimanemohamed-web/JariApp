"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { api, type Category } from "@/lib/api";

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "12px 14px", borderRadius: "10px",
  border: "1.5px solid #E5E5E5", fontSize: "0.95rem",
  outline: "none", boxSizing: "border-box", backgroundColor: "white",
};

export default function OnboardingPage() {
  const router = useRouter();
  const { user, token } = useAuth();
  const { dir } = useLanguage();

  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [experience, setExperience] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) { router.replace("/login"); return; }
    if (user.role !== "PRESTATAIRE") { router.replace("/"); return; }
    if (user.providerProfile?.onboardingDone) { router.replace("/"); return; }
    api.categories.list().then(setCategories);
  }, [user, router]);

  const toggleCategory = (id: string) =>
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleStep1 = async () => {
    if (selectedIds.length === 0) { setError("Sélectionnez au moins une catégorie"); return; }
    setError(""); setLoading(true);
    try {
      await api.providers.saveCategories(selectedIds, token!);
      setStep(2);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally { setLoading(false); }
  };

  const handleStep2 = async () => {
    if (bio.length < 20) { setError("La description doit faire au moins 20 caractères"); return; }
    if (!experience) { setError("Indiquez vos années d'expérience"); return; }
    setError(""); setLoading(true);
    try {
      await api.providers.saveProfile({
        bio, experienceYears: Number(experience),
        phone: phone || undefined,
      }, token!);
      router.push("/");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally { setLoading(false); }
  };

  const langName = (cat: Category) => {
    if (typeof document !== "undefined" && document.documentElement.lang === "ar") return cat.nameAr;
    if (typeof document !== "undefined" && document.documentElement.lang === "en") return cat.nameEn;
    return cat.nameFr;
  };

  if (!user) return null;

  return (
    <div dir={dir} style={{ minHeight: "100vh", backgroundColor: "#F8FAFC", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 16px" }}>

      {/* Progress */}
      <div style={{ width: "100%", maxWidth: "600px", marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0", marginBottom: "8px" }}>
          {[1, 2].map((s) => (
            <div key={s} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div style={{
                width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: "0.85rem",
                backgroundColor: step >= s ? "#FF6B35" : "#E5E5E5",
                color: step >= s ? "white" : "#999",
                transition: "all 0.3s",
              }}>{s}</div>
              {s < 2 && <div style={{ flex: 1, height: "2px", backgroundColor: step > s ? "#FF6B35" : "#E5E5E5", transition: "background 0.3s" }} />}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "0.75rem", color: step === 1 ? "#FF6B35" : "#999", fontWeight: step === 1 ? 600 : 400 }}>Catégories</span>
          <span style={{ fontSize: "0.75rem", color: step === 2 ? "#FF6B35" : "#999", fontWeight: step === 2 ? 600 : 400 }}>Profil</span>
        </div>
      </div>

      <div style={{ width: "100%", maxWidth: "600px", backgroundColor: "white", borderRadius: "24px", padding: "36px 32px", boxShadow: "0 8px 40px rgba(0,0,0,0.08)", border: "1px solid #F0F0F0" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "1px", marginBottom: "8px" }}>
            <span style={{ background: "linear-gradient(135deg, #FF6B35, #FF8C5A)", color: "white", fontWeight: 900, fontSize: "1.2rem", padding: "3px 10px", borderRadius: "9px" }}>jari</span>
            <span style={{ color: "#1B4F72", fontWeight: 800, fontSize: "1.2rem" }}>app</span>
          </div>
        </div>

        {/* ── STEP 1 : Categories ── */}
        {step === 1 && (
          <>
            <h1 style={{ color: "#0F172A", fontWeight: 800, fontSize: "1.4rem", marginBottom: "8px", textAlign: "center" }}>
              Vos domaines d'intervention
            </h1>
            <p style={{ color: "#64748B", fontSize: "0.9rem", textAlign: "center", marginBottom: "28px" }}>
              Sélectionnez toutes les catégories dans lesquelles vous proposez vos services
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "10px", marginBottom: "24px" }}>
              {categories.map((cat) => {
                const selected = selectedIds.includes(cat.id);
                return (
                  <button key={cat.id} type="button" onClick={() => toggleCategory(cat.id)} style={{
                    padding: "16px 10px", borderRadius: "14px", cursor: "pointer",
                    border: `2px solid ${selected ? "#FF6B35" : "#E5E5E5"}`,
                    backgroundColor: selected ? "#FFF0EB" : "#FAFAFA",
                    textAlign: "center", transition: "all 0.15s",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
                  }}>
                    <span style={{ fontSize: "1.8rem" }}>{cat.icon}</span>
                    <span style={{ color: selected ? "#FF6B35" : "#334155", fontWeight: 600, fontSize: "0.82rem", lineHeight: 1.2 }}>
                      {langName(cat)}
                    </span>
                    {selected && <span style={{ fontSize: "0.7rem", color: "#FF6B35", fontWeight: 700 }}>✓ Sélectionné</span>}
                  </button>
                );
              })}
            </div>

            {error && <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "10px", padding: "10px 14px", color: "#DC2626", fontSize: "0.85rem", marginBottom: "16px" }}>{error}</div>}

            <button onClick={handleStep1} disabled={loading || selectedIds.length === 0} style={{
              width: "100%", padding: "14px", borderRadius: "12px", border: "none",
              background: selectedIds.length === 0 ? "#E5E5E5" : "linear-gradient(135deg, #FF6B35, #FF5520)",
              color: selectedIds.length === 0 ? "#999" : "white",
              fontWeight: 700, fontSize: "1rem", cursor: selectedIds.length === 0 ? "not-allowed" : "pointer",
              boxShadow: selectedIds.length > 0 ? "0 4px 16px rgba(255,107,53,0.35)" : "none",
            }}>
              {loading ? "..." : `Continuer (${selectedIds.length} sélectionné${selectedIds.length > 1 ? "s" : ""})`}
            </button>
          </>
        )}

        {/* ── STEP 2 : Profile ── */}
        {step === 2 && (
          <>
            <h1 style={{ color: "#0F172A", fontWeight: 800, fontSize: "1.4rem", marginBottom: "8px", textAlign: "center" }}>
              Complétez votre profil
            </h1>
            <p style={{ color: "#64748B", fontSize: "0.9rem", textAlign: "center", marginBottom: "28px" }}>
              Ces informations seront visibles par les clients qui cherchent vos services
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", color: "#444", fontWeight: 600, fontSize: "0.875rem", marginBottom: "6px" }}>
                  Présentation <span style={{ color: "#FF6B35" }}>*</span>
                </label>
                <textarea
                  rows={4} value={bio} onChange={e => setBio(e.target.value)}
                  placeholder="Décrivez votre expérience, vos compétences, ce qui vous différencie…"
                  style={{ ...inputStyle, resize: "vertical", minHeight: "100px" }}
                  onFocus={e => e.target.style.borderColor = "#FF6B35"}
                  onBlur={e => e.target.style.borderColor = "#E5E5E5"}
                />
                <span style={{ color: bio.length < 20 ? "#F59E0B" : "#10B981", fontSize: "0.75rem", marginTop: "4px", display: "block" }}>
                  {bio.length}/600 caractères {bio.length < 20 ? `(minimum 20)` : "✓"}
                </span>
              </div>

              <div>
                <label style={{ display: "block", color: "#444", fontWeight: 600, fontSize: "0.875rem", marginBottom: "6px" }}>
                  Années d'expérience <span style={{ color: "#FF6B35" }}>*</span>
                </label>
                <select value={experience} onChange={e => setExperience(e.target.value)}
                  style={{ ...inputStyle, cursor: "pointer" }}
                  onFocus={e => e.target.style.borderColor = "#FF6B35"}
                  onBlur={e => e.target.style.borderColor = "#E5E5E5"}>
                  <option value="">Sélectionner</option>
                  <option value="0">Moins d'1 an</option>
                  <option value="1">1 an</option>
                  <option value="2">2 ans</option>
                  <option value="3">3 ans</option>
                  <option value="5">5 ans</option>
                  <option value="10">10 ans</option>
                  <option value="15">15 ans et plus</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", color: "#444", fontWeight: 600, fontSize: "0.875rem", marginBottom: "6px" }}>
                  Téléphone <span style={{ color: "#bbb", fontWeight: 400 }}>(optionnel)</span>
                </label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="0555 123 456" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#FF6B35"}
                  onBlur={e => e.target.style.borderColor = "#E5E5E5"} />
              </div>
            </div>

            {error && <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "10px", padding: "10px 14px", color: "#DC2626", fontSize: "0.85rem", marginTop: "16px" }}>{error}</div>}

            <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
              <button onClick={() => setStep(1)} style={{
                padding: "13px 20px", borderRadius: "12px",
                border: "1.5px solid #E5E5E5", backgroundColor: "white",
                color: "#555", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer",
              }}>
                ← Retour
              </button>
              <button onClick={handleStep2} disabled={loading} style={{
                flex: 1, padding: "13px", borderRadius: "12px", border: "none",
                background: "linear-gradient(135deg, #FF6B35, #FF5520)",
                color: "white", fontWeight: 700, fontSize: "1rem",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 4px 16px rgba(255,107,53,0.35)",
              }}>
                {loading ? "Enregistrement..." : "Terminer mon profil 🎉"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
