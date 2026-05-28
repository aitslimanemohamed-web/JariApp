import { Router } from "express";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { requireAuth, AuthRequest } from "../middleware/auth";

const prisma = new PrismaClient();
export const providersRouter = Router();

const providerSelect = {
  id: true, username: true, firstName: true, lastName: true,
  phone: true, wilaya: true, avatarUrl: true,
  providerProfile: {
    select: {
      bio: true, experienceYears: true, isAvailable: true,
      averageRating: true, totalReviews: true, onboardingDone: true,
      categories: {
        select: {
          category: { select: { id: true, slug: true, nameFr: true, nameAr: true, nameEn: true, icon: true } }
        }
      }
    }
  }
};

/* ── Step 1: save categories ── */
providersRouter.post("/onboarding/categories", requireAuth, async (req: AuthRequest, res) => {
  const schema = z.object({ categoryIds: z.array(z.string().uuid()).min(1) });
  const result = schema.safeParse(req.body);
  if (!result.success) { res.status(400).json({ error: result.error.flatten() }); return; }

  if (req.user!.role !== "PRESTATAIRE") { res.status(403).json({ error: "Réservé aux prestataires" }); return; }

  const { categoryIds } = result.data;

  const profile = await prisma.providerProfile.upsert({
    where: { userId: req.user!.id },
    create: { userId: req.user!.id },
    update: {},
  });

  await prisma.providerCategory.deleteMany({ where: { providerId: profile.id } });
  await prisma.providerCategory.createMany({
    data: categoryIds.map(categoryId => ({ providerId: profile.id, categoryId })),
  });

  res.json({ ok: true });
});

/* ── Step 2: complete profile ── */
providersRouter.post("/onboarding/profile", requireAuth, async (req: AuthRequest, res) => {
  const schema = z.object({
    bio: z.string().min(20).max(600),
    experienceYears: z.number().int().min(0).max(50),
    phone: z.string().optional(),
  });
  const result = schema.safeParse(req.body);
  if (!result.success) { res.status(400).json({ error: result.error.flatten() }); return; }

  if (req.user!.role !== "PRESTATAIRE") { res.status(403).json({ error: "Réservé aux prestataires" }); return; }

  const { bio, experienceYears, phone } = result.data;

  if (phone) {
    await prisma.user.update({ where: { id: req.user!.id }, data: { phone } });
  }

  const profile = await prisma.providerProfile.upsert({
    where: { userId: req.user!.id },
    create: { userId: req.user!.id, bio, experienceYears, onboardingDone: true },
    update: { bio, experienceYears, onboardingDone: true },
  });

  res.json({ ok: true, onboardingDone: profile.onboardingDone });
});

/* ── Get current provider profile ── */
providersRouter.get("/me", requireAuth, async (req: AuthRequest, res) => {
  if (req.user!.role !== "PRESTATAIRE") { res.status(403).json({ error: "Réservé aux prestataires" }); return; }

  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: providerSelect,
  });
  res.json(user);
});

/* ── Get provider by ID (public) ── */
providersRouter.get("/:id", async (req, res) => {
  const user = await prisma.user.findFirst({
    where: { id: req.params.id, role: "PRESTATAIRE" },
    select: providerSelect,
  });
  if (!user) { res.status(404).json({ error: "Prestataire introuvable" }); return; }
  res.json(user);
});
