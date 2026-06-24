"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/features/home/Hero";
import TrustSection from "@/features/home/TrustSection";
import ServicesSection from "@/features/home/ServicesSection";
import HowItWorks from "@/features/home/HowItWorks";
import Testimonials from "@/features/home/Testimonials";
import ProviderCTA from "@/features/home/ProviderCTA";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.replace("/feed");
  }, [user, loading, router]);

  if (loading) return null;
  if (user) return null;

  return (
    <>
      <Navbar />
      <Hero />
      <TrustSection />
      <ServicesSection />
      <HowItWorks />
      <Testimonials />
      <ProviderCTA />
      <Footer />
    </>
  );
}
