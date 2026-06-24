"use client";
import { useState, useEffect } from "react";
import FeedCard, { type Annonce, type AnnonceType } from "./FeedCard"; // AnnonceType utilisé dans GROUP_TYPES
import { useLanguage } from "@/contexts/LanguageContext";
import { api, type Annonce as ApiAnnonce } from "@/lib/api";

// Convertit une annonce API → format FeedCard
function adaptApiAnnonce(a: ApiAnnonce): Annonce {
  const typeMap: Record<string, AnnonceType> = {
    SERVICE: "service", DEMANDE: "demande", VENTE: "vente",
    LOCATION: "location", EMPLOI: "emploi",
  };
  return {
    id: Number(a.id.replace(/-/g, "").slice(0, 8)) || Math.random(),
    type:          typeMap[a.type] ?? "service",
    category:      a.category?.nameFr ?? "Autre",
    categoryIcon:  a.category?.icon  ?? "📌",
    title:         a.titre,
    description:   a.description,
    author:        `${a.user.firstName} ${a.user.lastName}`,
    authorInitial: a.user.firstName.charAt(0).toUpperCase(),
    wilaya:        a.wilayaName,
    time:          "À l'instant",
    isOwn:         true,
    ...(a.type === "EMPLOI" && { emploiSens: (a.details as { sens?: "recrute" | "candidate" }).sens }),
  };
}

const MOCK_FEED: Annonce[] = [
  { id: 1, type: "service", category: "Plomberie", categoryIcon: "🔧", title: "Plombier professionnel disponible", description: "Dépannage, installation, réparation. Disponible 7j/7 à Alger centre et périphérie.", author: "Karim B.", authorInitial: "K", wilaya: "Alger", price: "2 000 DA/h", time: "Il y a 2h" },
  { id: 2, type: "vente", category: "Électroménager", categoryIcon: "🔌", title: "Machine à laver Samsung 7kg", description: "Très bon état, 2 ans d'utilisation. Livraison possible sur Oran.", author: "Amina L.", authorInitial: "A", wilaya: "Oran", price: "35 000 DA", time: "Il y a 4h" },
  { id: 3, type: "demande", category: "Électricité", categoryIcon: "⚡", title: "Cherche électricien pour samedi", description: "Problème de tableau électrique dans un appartement F3. Besoin urgent.", author: "Mohamed A.", authorInitial: "M", wilaya: "Alger", price: "À négocier", time: "Il y a 6h" },
  { id: 4, type: "service", category: "Maçonnerie", categoryIcon: "🧱", title: "Maçon qualifié — travaux de construction", description: "15 ans d'expérience. Rénovation, extension, carrelage, enduit.", author: "Yacine D.", authorInitial: "Y", wilaya: "Constantine", price: "Sur devis", time: "Hier" },
  { id: 5, type: "vente", category: "Informatique", categoryIcon: "💻", title: "Laptop Dell Core i5 — 8Go RAM", description: "Excellent état, batterie neuve, SSD 256Go. Idéal pour étudiants.", author: "Sara M.", authorInitial: "S", wilaya: "Blida", price: "55 000 DA", time: "Hier" },
  { id: 6, type: "service", category: "Climatisation", categoryIcon: "❄️", title: "Technicien clim — installation & entretien", description: "Toutes marques. Devis gratuit sur place. Garantie pièces et main d'œuvre.", author: "Farid K.", authorInitial: "F", wilaya: "Alger", price: "3 500 DA", time: "Il y a 2j" },
  { id: 7, type: "demande", category: "Ménage", categoryIcon: "🧹", title: "Cherche femme de ménage à mi-temps", description: "3 fois par semaine, appartement 3 pièces à Oran. Sérieuse et ponctuelle.", author: "Nadia B.", authorInitial: "N", wilaya: "Oran", price: "15 000 DA/mois", time: "Il y a 2j" },
  { id: 8, type: "service", category: "Cours particuliers", categoryIcon: "📚", title: "Professeur maths & physique lycée", description: "10 ans d'expérience. Préparation bac, BEM et concours grandes écoles.", author: "Omar T.", authorInitial: "O", wilaya: "Sétif", price: "1 500 DA/h", time: "Il y a 3j" },
  { id: 9, type: "vente", category: "Mécanique", categoryIcon: "🚗", title: "Peugeot 206 — 2008 — Bon état", description: "Vidange faite, pneus neufs, carte grise à jour. Visite mécanique possible.", author: "Rachid A.", authorInitial: "R", wilaya: "Alger", price: "650 000 DA", time: "Il y a 3j" },
  { id: 10, type: "service", category: "Chauffeur", categoryIcon: "🚖", title: "Chauffeur VTC disponible — Alger", description: "Aéroport, hôpital, rendez-vous. Véhicule propre, ponctuel et discret.", author: "Bilal H.", authorInitial: "B", wilaya: "Alger", price: "500 DA/course", time: "Il y a 4j" },
  { id: 11, type: "demande", category: "Cours particuliers", categoryIcon: "📚", title: "Cours d'anglais pour adulte débutant", description: "2h par semaine à domicile à Constantine. Je peux me déplacer.", author: "Leila S.", authorInitial: "L", wilaya: "Constantine", price: "Selon accord", time: "Il y a 4j" },
  { id: 12, type: "service", category: "Informatique", categoryIcon: "💻", title: "Dépannage PC & installation logiciels", description: "Virus, lenteur, récupération de données, Windows. Déplacement à domicile.", author: "Nassim O.", authorInitial: "N", wilaya: "Blida", price: "1 000 DA", time: "Il y a 5j" },
  { id: 13, type: "emploi", category: "Restauration", categoryIcon: "🍕", title: "Pizzeria cherche livreur à mi-temps", description: "Scooter fourni. Horaires flexibles soir et week-end. Sérieux et ponctuel.", author: "Pizza Express", authorInitial: "P", wilaya: "Alger", price: "25 000 DA/mois", time: "Il y a 1j", emploiSens: "recrute" },
  { id: 14, type: "emploi", category: "Restauration", categoryIcon: "☕", title: "Café moderne cherche serveur expérimenté", description: "CDI temps plein. Bonne présentation exigée. Expérience minimum 1 an.", author: "Café Central", authorInitial: "C", wilaya: "Oran", price: "30 000 DA/mois", time: "Il y a 2j", emploiSens: "recrute" },
  { id: 15, type: "emploi", category: "Pâtisserie", categoryIcon: "🧁", title: "Pâtissier cherche poste — disponible immédiatement", description: "5 ans d'expérience. Spécialité gâteaux traditionnels et modernes. Sérieux.", author: "Hamza K.", authorInitial: "H", wilaya: "Constantine", price: "À négocier", time: "Il y a 3j", emploiSens: "candidate" },
  { id: 16, type: "emploi",   category: "Commerce",     categoryIcon: "🏪", title: "Supermarché recrute caissière", description: "Temps plein. Quartier Hydra. Expérience caisse souhaitée. Formation assurée.", author: "Marché Plus", authorInitial: "M", wilaya: "Alger", price: "28 000 DA/mois", time: "Il y a 4j", emploiSens: "recrute" },
  { id: 17, type: "location", category: "Véhicule",     categoryIcon: "🚗", title: "Renault Symbol 2018 — location journalière", description: "Climatisée, bon état. Kilométrage illimité sur Alger et périphérie.", author: "Walid R.", authorInitial: "W", wilaya: "Alger", price: "3 500 DA/j", time: "Il y a 3h" },
  { id: 18, type: "location", category: "Immobilier",   categoryIcon: "🏠", title: "Appartement F3 meublé — location courte durée", description: "Wifi, cuisine équipée, climatisé. Idéal déplacement professionnel.", author: "Houssem A.", authorInitial: "H", wilaya: "Oran", price: "4 500 DA/nuit", time: "Il y a 5h" },
  { id: 19, type: "location", category: "Outillage",    categoryIcon: "🔨", title: "Perceuse à percussion Bosch — location week-end", description: "Parfait état, accessoires inclus. Caution 5 000 DA.", author: "Kamel D.", authorInitial: "K", wilaya: "Blida", price: "500 DA/j", time: "Hier" },
  { id: 20, type: "location", category: "Électroménager", categoryIcon: "🧹", title: "Aspirateur industriel à louer", description: "Idéal fin de chantier, nettoyage après travaux. Livraison possible.", author: "Samir B.", authorInitial: "S", wilaya: "Constantine", price: "800 DA/j", time: "Il y a 2j" },
];

type GroupKey = "all" | "marche" | "services" | "emploi";

const GROUP_TYPES: Record<GroupKey, AnnonceType[]> = {
  all:      ["service", "vente", "demande", "emploi", "location"],
  marche:   ["vente", "location"],
  services: ["service", "demande"],
  emploi:   ["emploi"],
};

const GROUP_ICONS: Record<GroupKey, string> = {
  all: "✦", marche: "🏷️", services: "🔧", emploi: "💼",
};

interface Props { newAnnonces?: ApiAnnonce[]; }

export default function FeedSection({ newAnnonces = [] }: Props) {
  const [active, setActive]       = useState<GroupKey>("all");
  const [dbAnnonces, setDbAnnonces] = useState<ApiAnnonce[]>([]);
  const [apiReady, setApiReady]   = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    api.annonces.list()
      .then(res => { setDbAnnonces(res.data); setApiReady(true); })
      .catch(() => setApiReady(false)); // fallback mock si backend indisponible
  }, []);

  // Nouvelles annonces créées en session (optimistes, dédupliquées avec la DB)
  const dbIds     = new Set(dbAnnonces.map(a => a.id));
  const freshNew  = newAnnonces.filter(a => !dbIds.has(a.id));

  // Si la DB répond → données réelles ; sinon → mock de démonstration
  const allFeed = apiReady
    ? [...freshNew.map(adaptApiAnnonce), ...dbAnnonces.map(adaptApiAnnonce)]
    : [...freshNew.map(adaptApiAnnonce), ...MOCK_FEED];

  const filtered = allFeed.filter(a => GROUP_TYPES[active].includes(a.type));

  return (
    <div>
      {/* filtres groupés */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
        {(Object.keys(GROUP_TYPES) as GroupKey[]).map(key => {
          const isActive = active === key;
          const label = t.feed.filters[key];
          const count = allFeed.filter(a => GROUP_TYPES[key].includes(a.type)).length;
          return (
            <button key={key} onClick={() => setActive(key)} style={{
              padding: "8px 18px", borderRadius: "100px", cursor: "pointer",
              border: isActive ? "none" : "1.5px solid #E5E5E5",
              background: isActive ? "linear-gradient(135deg, #FF6B35, #FF5520)" : "white",
              color: isActive ? "white" : "#64748B",
              fontWeight: isActive ? 700 : 500,
              fontSize: "0.85rem",
              boxShadow: isActive ? "0 3px 10px rgba(255,107,53,0.3)" : "none",
              transition: "all 0.15s",
              display: "flex", alignItems: "center", gap: "5px",
            }}>
              <span style={{ fontSize: "0.8rem" }}>{GROUP_ICONS[key]}</span>
              {label}
              <span style={{ fontSize: "0.72rem", opacity: 0.7, marginLeft: "2px" }}>({count})</span>
            </button>
          );
        })}
      </div>

      {/* grille */}
      <div className="jari-grid-feed">
        {filtered.map(ann => (
          <FeedCard key={ann.id} annonce={ann} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px 0", color: "#94A3B8" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>🔍</div>
          <div style={{ fontWeight: 600 }}>Aucune annonce pour le moment</div>
        </div>
      )}
    </div>
  );
}
