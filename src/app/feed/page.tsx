"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { type Annonce } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PublishBar from "@/features/feed/PublishBar";
import MyAnnonces from "@/features/feed/MyAnnonces";
import FeedSection from "@/features/feed/FeedSection";

export default function FeedPage() {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [newAnnonces, setNewAnnonces] = useState<Annonce[]>([]);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <>
      <Navbar />
      <main style={{ backgroundColor: "#F8FAFC", minHeight: "calc(100vh - 64px)" }}>
        <div className="jari-wrap" style={{ paddingTop: "32px", paddingBottom: "64px" }}>

          {/* header */}
          <div style={{ marginBottom: "28px" }}>
            <h1 style={{ color: "#0F172A", fontWeight: 900, fontSize: "clamp(1.3rem, 3vw, 1.8rem)", letterSpacing: "-0.5px", marginBottom: "4px" }}>
              {t.feed.greeting} {user.firstName} 👋
            </h1>
            <p style={{ color: "#64748B", fontSize: "0.9rem" }}>
              {t.feed.subtitle}
            </p>
          </div>

          <PublishBar onNewAnnonce={a => setNewAnnonces(prev => [a, ...prev])} />
          <MyAnnonces />

          {/* séparateur */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "24px" }}>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#EEF0F4" }} />
            <span style={{ color: "#94A3B8", fontSize: "0.8rem", fontWeight: 600, whiteSpace: "nowrap" }}>
              {t.feed.recentAnnonces}
            </span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#EEF0F4" }} />
          </div>

          <FeedSection newAnnonces={newAnnonces} />
        </div>
      </main>
      <Footer />
    </>
  );
}
