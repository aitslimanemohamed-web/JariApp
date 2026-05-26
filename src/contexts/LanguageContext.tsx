"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Lang = "fr" | "ar" | "en";

const translations = {
  fr: {
    nav: {
      services: "Services",
      howItWorks: "Comment ça marche",
      becomeProvider: "Devenir prestataire",
      login: "Connexion",
      register: "S'inscrire",
    },
    auth: {
      login: {
        title: "Connexion",
        subtitle: "Content de vous revoir 👋",
        username: "Nom d'utilisateur",
        usernamePlaceholder: "votre_pseudo",
        password: "Mot de passe",
        passwordPlaceholder: "••••••••",
        submit: "Se connecter",
        loading: "Connexion...",
        noAccount: "Pas encore de compte ?",
        signUp: "S'inscrire",
      },
      register: {
        title: "Créer un compte",
        subtitle: "Rejoignez la communauté JariApp 🇩🇿",
        seekingLabel: "🔍 Je cherche",
        providingLabel: "🔧 Je propose",
        firstName: "Prénom",
        lastName: "Nom",
        username: "Nom d'utilisateur",
        usernamePlaceholder: "votre_pseudo",
        usernameHint: "Lettres, chiffres et _ uniquement",
        phone: "Téléphone",
        phoneOptional: "(optionnel)",
        phonePlaceholder: "0555 123 456",
        wilaya: "Wilaya",
        wilayaPlaceholder: "Sélectionner votre wilaya",
        password: "Mot de passe",
        passwordPlaceholder: "Minimum 6 caractères",
        submit: "Créer mon compte",
        loading: "Inscription...",
        hasAccount: "Déjà un compte ?",
        signIn: "Se connecter",
      },
    },
    hero: {
      badge: "🇩🇿 Disponible en Algérie",
      line1: "Trouvez des prestataires",
      highlight: "de confiance",
      line2: "près de chez vous",
      sub: "Plomberie, électricité, ménage, cours particuliers… Réservez un professionnel vérifié dans votre quartier en quelques minutes.",
      cta1: "Trouver un prestataire",
      cta2: "Comment ça marche",
    },
    stats: {
      providers: "prestataires actifs",
      cities: "wilayas couvertes",
      rating: "note moyenne",
    },
    services: {
      title: "Nos catégories de services",
      sub: "Des centaines de prestataires qualifiés dans toute l'Algérie",
      items: [
        "Plomberie", "Électricité", "Ménage", "Cours particuliers",
        "Peinture", "Climatisation", "Mécanique", "Déménagement",
      ],
    },
    how: {
      title: "Comment ça marche ?",
      sub: "Réservez un service en 3 étapes simples",
      steps: [
        { title: "Décrivez votre besoin", desc: "Choisissez la catégorie et décrivez votre besoin en quelques mots." },
        { title: "Choisissez un prestataire", desc: "Parcourez les profils vérifiés près de vous avec avis et tarifs." },
        { title: "Réservez & profitez", desc: "Confirmez la réservation, le prestataire se déplace chez vous à l'heure dite." },
      ],
    },
    provider: {
      title: "Vous êtes prestataire ?",
      sub: "Rejoignez notre réseau, trouvez de nouveaux clients près de chez vous. Inscription 100% gratuite.",
      cta: "Devenir prestataire →",
    },
    footer: {
      tagline: "Services entre voisins en Algérie",
      links: ["Confidentialité", "CGU", "Contact"],
      rights: "© 2024 JariApp. Tous droits réservés.",
    },
  },
  ar: {
    nav: {
      services: "الخدمات",
      howItWorks: "كيف يعمل",
      becomeProvider: "كن مزود خدمة",
      login: "تسجيل الدخول",
      register: "إنشاء حساب",
    },
    auth: {
      login: {
        title: "تسجيل الدخول",
        subtitle: "مرحباً بعودتك 👋",
        username: "اسم المستخدم",
        usernamePlaceholder: "اسم_المستخدم",
        password: "كلمة المرور",
        passwordPlaceholder: "••••••••",
        submit: "تسجيل الدخول",
        loading: "جارٍ الدخول...",
        noAccount: "ليس لديك حساب؟",
        signUp: "إنشاء حساب",
      },
      register: {
        title: "إنشاء حساب",
        subtitle: "انضم إلى مجتمع JariApp 🇩🇿",
        seekingLabel: "🔍 أبحث عن خدمة",
        providingLabel: "🔧 أقدم خدمة",
        firstName: "الاسم الأول",
        lastName: "اللقب",
        username: "اسم المستخدم",
        usernamePlaceholder: "اسم_المستخدم",
        usernameHint: "حروف وأرقام و _ فقط",
        phone: "الهاتف",
        phoneOptional: "(اختياري)",
        phonePlaceholder: "0555 123 456",
        wilaya: "الولاية",
        wilayaPlaceholder: "اختر ولايتك",
        password: "كلمة المرور",
        passwordPlaceholder: "6 أحرف على الأقل",
        submit: "إنشاء الحساب",
        loading: "جارٍ التسجيل...",
        hasAccount: "لديك حساب؟",
        signIn: "تسجيل الدخول",
      },
    },
    hero: {
      badge: "🇩🇿 متوفر في الجزائر",
      line1: "ابحث عن مزودي خدمات",
      highlight: "موثوقين",
      line2: "بالقرب منك",
      sub: "سباكة، كهرباء، تنظيف، دروس خصوصية… احجز محترفًا موثقًا في حيّك خلال دقائق.",
      cta1: "ابحث عن مزود خدمة",
      cta2: "كيف يعمل",
    },
    stats: {
      providers: "مزود خدمة نشط",
      cities: "ولاية مغطاة",
      rating: "متوسط التقييم",
    },
    services: {
      title: "فئات خدماتنا",
      sub: "مئات المحترفين المؤهلين في جميع أنحاء الجزائر",
      items: [
        "سباكة", "كهرباء", "تنظيف", "دروس خاصة",
        "دهن وديكور", "تكييف", "ميكانيكا", "نقل عفش",
      ],
    },
    how: {
      title: "كيف يعمل؟",
      sub: "احجز خدمة في 3 خطوات بسيطة",
      steps: [
        { title: "صف احتياجك", desc: "اختر الفئة وصف ما تحتاجه في بضع كلمات." },
        { title: "اختر مزود الخدمة", desc: "تصفح الملفات الشخصية الموثقة بالقرب منك مع التقييمات والأسعار." },
        { title: "احجز واستمتع", desc: "أكد الحجز وسيأتي مزود الخدمة إليك في الوقت المحدد." },
      ],
    },
    provider: {
      title: "هل أنت مزود خدمة؟",
      sub: "انضم إلى شبكتنا واعثر على عملاء جدد بالقرب منك. التسجيل مجاني 100%.",
      cta: "← كن مزود خدمة",
    },
    footer: {
      tagline: "خدمات بين الجيران في الجزائر",
      links: ["الخصوصية", "الشروط", "اتصل بنا"],
      rights: "© 2024 JariApp. جميع الحقوق محفوظة.",
    },
  },
  en: {
    nav: {
      services: "Services",
      howItWorks: "How it works",
      becomeProvider: "Become a provider",
      login: "Log in",
      register: "Sign up",
    },
    auth: {
      login: {
        title: "Log in",
        subtitle: "Welcome back 👋",
        username: "Username",
        usernamePlaceholder: "your_username",
        password: "Password",
        passwordPlaceholder: "••••••••",
        submit: "Log in",
        loading: "Logging in...",
        noAccount: "No account yet?",
        signUp: "Sign up",
      },
      register: {
        title: "Create an account",
        subtitle: "Join the JariApp community 🇩🇿",
        seekingLabel: "🔍 I'm looking",
        providingLabel: "🔧 I'm offering",
        firstName: "First name",
        lastName: "Last name",
        username: "Username",
        usernamePlaceholder: "your_username",
        usernameHint: "Letters, numbers and _ only",
        phone: "Phone",
        phoneOptional: "(optional)",
        phonePlaceholder: "0555 123 456",
        wilaya: "Wilaya",
        wilayaPlaceholder: "Select your wilaya",
        password: "Password",
        passwordPlaceholder: "Minimum 6 characters",
        submit: "Create my account",
        loading: "Signing up...",
        hasAccount: "Already have an account?",
        signIn: "Log in",
      },
    },
    hero: {
      badge: "🇩🇿 Available in Algeria",
      line1: "Find trusted",
      highlight: "service providers",
      line2: "near you",
      sub: "Plumbing, electricity, cleaning, tutoring… Book a verified professional in your neighborhood in minutes.",
      cta1: "Find a provider",
      cta2: "How it works",
    },
    stats: {
      providers: "active providers",
      cities: "wilayas covered",
      rating: "average rating",
    },
    services: {
      title: "Our service categories",
      sub: "Hundreds of qualified providers across Algeria",
      items: [
        "Plumbing", "Electricity", "Cleaning", "Tutoring",
        "Painting", "A/C & Heating", "Mechanics", "Moving",
      ],
    },
    how: {
      title: "How does it work?",
      sub: "Book a service in 3 simple steps",
      steps: [
        { title: "Describe your need", desc: "Choose the category and describe what you need in a few words." },
        { title: "Choose a provider", desc: "Browse verified profiles near you with reviews and rates." },
        { title: "Book & enjoy", desc: "Confirm the booking and the provider comes to you at the agreed time." },
      ],
    },
    provider: {
      title: "Are you a provider?",
      sub: "Join our network and find new clients near you. 100% free registration.",
      cta: "Become a provider →",
    },
    footer: {
      tagline: "Neighbor services in Algeria",
      links: ["Privacy", "Terms", "Contact"],
      rights: "© 2024 JariApp. All rights reserved.",
    },
  },
};

type Translations = typeof translations.fr;

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "fr",
  setLang: () => {},
  t: translations.fr,
  dir: "ltr",
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("fr");
  const dir: "ltr" | "rtl" = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang], dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
