export interface Message {
  id: number;
  from: "me" | "other";
  text: string;
  time: string;
}

export interface Conversation {
  id: number;
  name: string;
  initial: string;
  subject: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  messages: Message[];
}

export const CONVERSATIONS: Conversation[] = [
  {
    id: 1, name: "Karim B.", initial: "K", online: true, unread: 2,
    subject: "Plomberie — fuite cuisine",
    lastMessage: "D'accord, je serai là à 10h précises.",
    time: "10:34",
    messages: [
      { id: 1, from: "me",    text: "Bonjour, j'ai une fuite sous l'évier de ma cuisine, vous êtes disponible cette semaine ?", time: "09:12" },
      { id: 2, from: "other", text: "Bonjour ! Oui bien sûr, je peux passer jeudi matin. Vous êtes disponible vers 10h ?", time: "09:20" },
      { id: 3, from: "me",    text: "Parfait, jeudi 10h ça me convient. C'est au 3ème étage, il y a un ascenseur.", time: "09:45" },
      { id: 4, from: "other", text: "Pas de problème, j'apporte tout le matériel nécessaire. Quel est l'adresse exacte ?", time: "10:01" },
      { id: 5, from: "me",    text: "12 rue des Pins, résidence El Wiam, Bab Ezzouar.", time: "10:15" },
      { id: 6, from: "other", text: "D'accord, je serai là à 10h précises.", time: "10:34" },
    ],
  },
  {
    id: 2, name: "Amina L.", initial: "A", online: false, unread: 0,
    subject: "Machine à laver Samsung",
    lastMessage: "Toujours disponible pour la vente ?",
    time: "Hier",
    messages: [
      { id: 1, from: "other", text: "Bonjour, votre machine à laver est toujours disponible ?", time: "Hier 14:20" },
      { id: 2, from: "me",    text: "Bonjour oui, elle est encore disponible ! Vous voulez la voir ?", time: "Hier 15:05" },
      { id: 3, from: "other", text: "Oui avec plaisir, je peux passer samedi ?", time: "Hier 15:30" },
      { id: 4, from: "me",    text: "Samedi c'est parfait, vers 16h ?", time: "Hier 15:45" },
      { id: 5, from: "other", text: "Toujours disponible pour la vente ?", time: "Hier 18:00" },
    ],
  },
  {
    id: 3, name: "Pizza Express", initial: "P", online: true, unread: 1,
    subject: "Candidature livreur",
    lastMessage: "Votre candidature a été retenue 🎉",
    time: "Lun",
    messages: [
      { id: 1, from: "me",    text: "Bonjour, je postule pour le poste de livreur à mi-temps.", time: "Lun 09:00" },
      { id: 2, from: "other", text: "Bonjour ! Merci pour votre intérêt. Avez-vous un scooter personnel ?", time: "Lun 10:30" },
      { id: 3, from: "me",    text: "Oui j'ai un scooter 125cc, permis A en cours de validité.", time: "Lun 11:00" },
      { id: 4, from: "other", text: "Votre candidature a été retenue 🎉", time: "Lun 14:00" },
    ],
  },
  {
    id: 4, name: "Yacine D.", initial: "Y", online: false, unread: 0,
    subject: "Travaux maçonnerie",
    lastMessage: "Je viendrai faire une estimation gratuite.",
    time: "Dim",
    messages: [
      { id: 1, from: "me",    text: "Bonjour, j'aurais besoin d'un devis pour agrandir une chambre.", time: "Dim 11:00" },
      { id: 2, from: "other", text: "Bonjour, pas de problème. Quelle est la surface approximative ?", time: "Dim 12:30" },
      { id: 3, from: "me",    text: "Environ 12m². Murs en parpaing.", time: "Dim 13:00" },
      { id: 4, from: "other", text: "Je viendrai faire une estimation gratuite.", time: "Dim 14:00" },
    ],
  },
  {
    id: 5, name: "Nassim O.", initial: "N", online: false, unread: 0,
    subject: "Dépannage PC",
    lastMessage: "PC récupéré, tout fonctionne ! Merci 👍",
    time: "Il y a 5j",
    messages: [
      { id: 1, from: "me",    text: "Bonjour mon PC est très lent, possible de regarder ?", time: "Il y a 6j" },
      { id: 2, from: "other", text: "Oui bien sûr, c'est probablement un virus ou le disque dur. Je peux récupérer le PC.", time: "Il y a 6j" },
      { id: 3, from: "other", text: "PC récupéré, tout fonctionne ! Merci 👍", time: "Il y a 5j" },
    ],
  },
];
