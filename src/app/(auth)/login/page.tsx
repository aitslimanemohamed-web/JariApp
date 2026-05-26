"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "12px 14px", borderRadius: "10px",
  border: "1.5px solid #E5E5E5", fontSize: "0.95rem",
  outline: "none", boxSizing: "border-box", backgroundColor: "white",
};

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { t, dir } = useLanguage();
  const a = t.auth.login;

  const [form, setForm]       = useState({ username: "", password: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.username, form.password);
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: "420px" }} dir={dir}>
      <div style={{ backgroundColor: "white", borderRadius: "20px", padding: "40px 36px", boxShadow: "0 4px 32px rgba(0,0,0,0.08)", border: "1px solid #F0F0F0" }}>

        <h1 style={{ color: "#1A1A2E", fontWeight: 800, fontSize: "1.7rem", marginBottom: "8px" }}>
          {a.title}
        </h1>
        <p style={{ color: "#888", fontSize: "0.95rem", marginBottom: "28px" }}>
          {a.subtitle}
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", color: "#444", fontWeight: 600, fontSize: "0.875rem", marginBottom: "6px" }}>
              {a.username}
            </label>
            <input
              type="text" required autoComplete="username"
              placeholder={a.usernamePlaceholder}
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#FF6B35"}
              onBlur={e => e.target.style.borderColor = "#E5E5E5"}
            />
          </div>

          <div>
            <label style={{ display: "block", color: "#444", fontWeight: 600, fontSize: "0.875rem", marginBottom: "6px" }}>
              {a.password}
            </label>
            <input
              type="password" required autoComplete="current-password"
              placeholder={a.passwordPlaceholder}
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#FF6B35"}
              onBlur={e => e.target.style.borderColor = "#E5E5E5"}
            />
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
          {a.noAccount}{" "}
          <Link href="/register" style={{ color: "#FF6B35", fontWeight: 600 }}>
            {a.signUp}
          </Link>
        </p>
      </div>
    </div>
  );
}
