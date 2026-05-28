import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CATEGORIES = [
  { slug: "plomberie",    nameFr: "Plomberie",       nameAr: "سباكة",        nameEn: "Plumbing",      icon: "🔧" },
  { slug: "electricite",  nameFr: "Électricité",     nameAr: "كهرباء",       nameEn: "Electricity",   icon: "⚡" },
  { slug: "menage",       nameFr: "Ménage",           nameAr: "تنظيف",        nameEn: "Cleaning",      icon: "🧹" },
  { slug: "cours",        nameFr: "Cours particuliers", nameAr: "دروس خاصة", nameEn: "Tutoring",      icon: "📚" },
  { slug: "peinture",     nameFr: "Peinture",         nameAr: "دهن وديكور",  nameEn: "Painting",      icon: "🎨" },
  { slug: "climatisation",nameFr: "Climatisation",   nameAr: "تكييف",        nameEn: "A/C & Heating", icon: "❄️" },
  { slug: "mecanique",    nameFr: "Mécanique",        nameAr: "ميكانيكا",     nameEn: "Mechanics",     icon: "🚗" },
  { slug: "demenagement", nameFr: "Déménagement",     nameAr: "نقل عفش",     nameEn: "Moving",        icon: "📦" },
];

async function main() {
  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }
  console.log("✅ Categories seeded");
}

main().catch(console.error).finally(() => prisma.$disconnect());
