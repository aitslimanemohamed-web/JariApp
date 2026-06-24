"use client";
import { useState } from "react";
import FeedCard, { type Annonce, type AnnonceType } from "./FeedCard";

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

const FILTERS: { key: AnnonceType | "all"; label: string }[] = [
  { key: "all",     label: "Tout" },
  { key: "service", label: "Services" },
  { key: "emploi",   label: "Emplois" },
  { key: "location", label: "Locations" },
  { key: "vente",    label: "Ventes" },
  { key: "demande",  label: "Demandes" },
];

export default function FeedSection() {
  const [active, setActive] = useState<AnnonceType | "all">("all");

  const filtered = active === "all" ? MOCK_FEED : MOCK_FEED.filter(a => a.type === active);

  return (
    <div>
      {/* filtres */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
        {FILTERS.map(f => {
          const isActive = active === f.key;
          return (
            <button key={f.key} onClick={() => setActive(f.key)} style={{
              padding: "8px 18px", borderRadius: "100px", cursor: "pointer",
              border: isActive ? "none" : "1.5px solid #E5E5E5",
              background: isActive ? "linear-gradient(135deg, #FF6B35, #FF5520)" : "white",
              color: isActive ? "white" : "#64748B",
              fontWeight: isActive ? 700 : 500,
              fontSize: "0.85rem",
              boxShadow: isActive ? "0 3px 10px rgba(255,107,53,0.3)" : "none",
              transition: "all 0.15s",
            }}>
              {f.label}
              <span style={{ marginLeft: "6px", fontSize: "0.72rem", opacity: 0.75 }}>
                ({active === f.key || f.key === "all"
                  ? f.key === "all" ? MOCK_FEED.length : MOCK_FEED.filter(a => a.type === f.key).length
                  : MOCK_FEED.filter(a => a.type === f.key).length})
              </span>
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
