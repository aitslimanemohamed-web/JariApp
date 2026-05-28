"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

const WILAYAS = [
  { id: 1, name: "Adrar" }, { id: 2, name: "Chlef" }, { id: 3, name: "Laghouat" },
  { id: 4, name: "Oum El Bouaghi" }, { id: 5, name: "Batna" }, { id: 6, name: "Béjaïa" },
  { id: 7, name: "Biskra" }, { id: 8, name: "Béchar" }, { id: 9, name: "Blida" },
  { id: 10, name: "Bouira" }, { id: 11, name: "Tamanrasset" }, { id: 12, name: "Tébessa" },
  { id: 13, name: "Tlemcen" }, { id: 14, name: "Tiaret" }, { id: 15, name: "Tizi Ouzou" },
  { id: 16, name: "Alger" }, { id: 17, name: "Djelfa" }, { id: 18, name: "Jijel" },
  { id: 19, name: "Sétif" }, { id: 20, name: "Saïda" }, { id: 21, name: "Skikda" },
  { id: 22, name: "Sidi Bel Abbès" }, { id: 23, name: "Annaba" }, { id: 24, name: "Guelma" },
  { id: 25, name: "Constantine" }, { id: 26, name: "Médéa" }, { id: 27, name: "Mostaganem" },
  { id: 28, name: "M'Sila" }, { id: 29, name: "Mascara" }, { id: 30, name: "Ouargla" },
  { id: 31, name: "Oran" }, { id: 32, name: "El Bayadh" }, { id: 33, name: "Illizi" },
  { id: 34, name: "Bordj Bou Arréridj" }, { id: 35, name: "Boumerdès" }, { id: 36, name: "El Tarf" },
  { id: 37, name: "Tindouf" }, { id: 38, name: "Tissemsilt" }, { id: 39, name: "El Oued" },
  { id: 40, name: "Khenchela" }, { id: 41, name: "Souk Ahras" }, { id: 42, name: "Tipaza" },
  { id: 43, name: "Mila" }, { id: 44, name: "Aïn Defla" }, { id: 45, name: "Naâma" },
  { id: 46, name: "Aïn Témouchent" }, { id: 47, name: "Ghardaïa" }, { id: 48, name: "Relizane" },
];

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "12px 14px", borderRadius: "10px",
  border: "1.5px solid #E5E5E5", fontSize: "0.95rem",
  outline: "none", boxSizing: "border-box", backgroundColor: "white",
};
const labelStyle: React.CSSProperties = {
  display: "block", color: "#444", fontWeight: 600,
  fontSize: "0.875rem", marginBottom: "6px",
};

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { t, dir } = useLanguage();
  const a = t.auth.register;

  const [form, setForm] = useState({
    firstName: "", lastName: "", username: "",
    password: "", phone: "",
    role: "CLIENT" as "CLIENT" | "PRESTATAIRE",
    wilaya: "",
  });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.auth.register({
        ...form,
        wilaya: form.wilaya ? Number(form.wilaya) : undefined,
      });
      await login(form.username, form.password);
      router.push(form.role === "PRESTATAIRE" ? "/onboarding" : "/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: "480px" }} dir={dir}>
      <div style={{ backgroundColor: "white", borderRadius: "20px", padding: "40px 36px", boxShadow: "0 4px 32px rgba(0,0,0,0.08)", border: "1px solid #F0F0F0" }}>

        <h1 style={{ color: "#1A1A2E", fontWeight: 800, fontSize: "1.7rem", marginBottom: "8px" }}>
          {a.title}
        </h1>
        <p style={{ color: "#888", fontSize: "0.95rem", marginBottom: "24px" }}>
          {a.subtitle}
        </p>

        {/* Role selector */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
          {(["CLIENT", "PRESTATAIRE"] as const).map(r => (
            <button key={r} type="button" onClick={() => set("role", r)} style={{
              flex: 1, padding: "12px", borderRadius: "10px", border: "2px solid",
              borderColor: form.role === r ? "#FF6B35" : "#E5E5E5",
              backgroundColor: form.role === r ? "#FFF0EB" : "white",
              color: form.role === r ? "#FF6B35" : "#888",
              fontWeight: 600, fontSize: "0.9rem", cursor: "pointer",
            }}>
              {r === "CLIENT" ? a.seekingLabel : a.providingLabel}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div>
              <label style={labelStyle}>{a.firstName}</label>
              <input style={inputStyle} required value={form.firstName}
                onChange={e => set("firstName", e.target.value)}
                onFocus={e => e.target.style.borderColor = "#FF6B35"}
                onBlur={e => e.target.style.borderColor = "#E5E5E5"} />
            </div>
            <div>
              <label style={labelStyle}>{a.lastName}</label>
              <input style={inputStyle} required value={form.lastName}
                onChange={e => set("lastName", e.target.value)}
                onFocus={e => e.target.style.borderColor = "#FF6B35"}
                onBlur={e => e.target.style.borderColor = "#E5E5E5"} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>{a.username}</label>
            <input style={inputStyle} required autoComplete="username"
              placeholder={a.usernamePlaceholder}
              value={form.username}
              onChange={e => set("username", e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))}
              onFocus={e => e.target.style.borderColor = "#FF6B35"}
              onBlur={e => e.target.style.borderColor = "#E5E5E5"} />
            <span style={{ color: "#aaa", fontSize: "0.78rem", marginTop: "4px", display: "block" }}>
              {a.usernameHint}
            </span>
          </div>

          <div>
            <label style={labelStyle}>
              {a.phone} <span style={{ color: "#bbb", fontWeight: 400 }}>{a.phoneOptional}</span>
            </label>
            <input style={inputStyle} type="tel" placeholder={a.phonePlaceholder} value={form.phone}
              onChange={e => set("phone", e.target.value)}
              onFocus={e => e.target.style.borderColor = "#FF6B35"}
              onBlur={e => e.target.style.borderColor = "#E5E5E5"} />
          </div>

          <div>
            <label style={labelStyle}>{a.wilaya}</label>
            <select style={{ ...inputStyle, cursor: "pointer" }} value={form.wilaya}
              onChange={e => set("wilaya", e.target.value)}
              onFocus={e => e.target.style.borderColor = "#FF6B35"}
              onBlur={e => e.target.style.borderColor = "#E5E5E5"}>
              <option value="">{a.wilayaPlaceholder}</option>
              {WILAYAS.map(w => (
                <option key={w.id} value={w.id}>{w.id < 10 ? `0${w.id}` : w.id} - {w.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>{a.password}</label>
            <input style={inputStyle} type="password" required minLength={6}
              placeholder={a.passwordPlaceholder} value={form.password}
              autoComplete="new-password"
              onChange={e => set("password", e.target.value)}
              onFocus={e => e.target.style.borderColor = "#FF6B35"}
              onBlur={e => e.target.style.borderColor = "#E5E5E5"} />
          </div>

          {error && (
            <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "10px", padding: "12px 14px", color: "#DC2626", fontSize: "0.875rem" }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            backgroundColor: loading ? "#ccc" : "#FF6B35",
            color: "white", fontWeight: 700, fontSize: "1rem",
            padding: "14px", borderRadius: "10px", border: "none",
            cursor: loading ? "not-allowed" : "pointer", marginTop: "4px",
          }}>
            {loading ? a.loading : a.submit}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "24px", color: "#888", fontSize: "0.9rem" }}>
          {a.hasAccount}{" "}
          <Link href="/login" style={{ color: "#FF6B35", fontWeight: 600 }}>{a.signIn}</Link>
        </p>
      </div>
    </div>
  );
}
