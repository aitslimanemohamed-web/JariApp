import { Router } from "express";
import { z } from "zod";
import { PrismaClient, Prisma } from "@prisma/client";
import { requireAuth, AuthRequest } from "../middleware/auth";

const prisma = new PrismaClient();
export const annoncesRouter = Router();

// ─── Enums locaux (miroir de Prisma) ──────────────────────────────────────────

const AnnonceTypeEnum   = z.enum(["SERVICE", "DEMANDE", "VENTE", "LOCATION", "EMPLOI"]);
const AnnonceStatusEnum = z.enum(["ACTIVE", "PAUSED", "CLOSED"]);

// ─── Schémas details par type ─────────────────────────────────────────────────

const detailsSchemas = {
  SERVICE:  z.object({ disponibilite: z.enum(["IMMEDIATE", "RDV", "PARTIEL"]) }),
  DEMANDE:  z.object({ date_souhaitee: z.string().nullable(), date_flexible: z.boolean() }),
  VENTE:    z.object({ prix: z.number().positive(), negociable: z.boolean().default(false) }),
  LOCATION: z.object({ prix: z.number().positive(), unite: z.enum(["heure", "jour", "semaine", "mois"]) }),
  EMPLOI:   z.object({ sens: z.enum(["RECRUTE", "CANDIDATE"]), type_contrat: z.string().optional() }),
} as const;

// ─── Schémas de validation ─────────────────────────────────────────────────────

const baseSchema = z.object({
  type:        AnnonceTypeEnum,
  titre:       z.string().min(5).max(200),
  description: z.string().min(10),
  wilayaId:    z.number().int().min(1).max(58), // 58 wilayas depuis 2019
  wilayaName:  z.string().min(2),
  categoryId:  z.string().uuid().optional(),
  details:     z.record(z.unknown()).default({}),
});

const createAnnonceSchema = baseSchema.superRefine((data, ctx) => {
  const schema = detailsSchemas[data.type];
  const result = schema.safeParse(data.details);
  if (!result.success) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["details"],
      message: `Champs details invalides pour le type ${data.type}`,
    });
  }
});

// Pour les mises à jour partielles on valide sans superRefine (type non modifiable)
const updateAnnonceSchema = baseSchema.omit({ type: true }).partial();

const statusSchema = z.object({ status: AnnonceStatusEnum });

// ─── Sélection commune ─────────────────────────────────────────────────────────

const annonceSelect = {
  id: true, type: true, status: true,
  titre: true, description: true,
  wilayaId: true, wilayaName: true,
  details: true, viewsCount: true,
  createdAt: true, updatedAt: true,
  user:     { select: { id: true, firstName: true, lastName: true, username: true, avatarUrl: true } },
  category: { select: { id: true, slug: true, nameFr: true, nameAr: true, nameEn: true, icon: true } },
};

// ─── GET /annonces — liste publique ───────────────────────────────────────────

annoncesRouter.get("/", async (req, res) => {
  try {
    const { type, wilaya, categoryId, q, page = "1", limit = "20" } = req.query;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = { status: "ACTIVE" };
    if (type)       where.type       = type;
    if (wilaya)     where.wilayaId   = Number(wilaya);
    if (categoryId) where.categoryId = categoryId;
    if (q) {
      where.OR = [
        { titre:       { contains: q as string, mode: "insensitive" } },
        { description: { contains: q as string, mode: "insensitive" } },
      ];
    }

    const [annonces, total] = await Promise.all([
      prisma.annonce.findMany({
        where,
        select: annonceSelect,
        orderBy: { createdAt: "desc" },
        skip:  (Number(page) - 1) * Number(limit),
        take:  Number(limit),
      }),
      prisma.annonce.count({ where }),
    ]);

    res.json({ data: annonces, total, page: Number(page), limit: Number(limit) });
  } catch {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ─── GET /annonces/me — mes annonces (auth) ───────────────────────────────────

annoncesRouter.get("/me", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { status, type } = req.query;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = { userId: req.user!.id };
    if (status) where.status = status;
    if (type)   where.type   = type;

    const annonces = await prisma.annonce.findMany({
      where,
      select: annonceSelect,
      orderBy: { createdAt: "desc" },
    });

    res.json(annonces);
  } catch {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ─── GET /annonces/:id — détail + incrément vues ──────────────────────────────

annoncesRouter.get("/:id", async (req, res) => {
  try {
    const annonce = await prisma.annonce.findUnique({
      where: { id: req.params.id },
      select: annonceSelect,
    });

    if (!annonce) { res.status(404).json({ error: "Annonce introuvable" }); return; }

    prisma.annonce.update({
      where: { id: req.params.id },
      data:  { viewsCount: { increment: 1 } },
    }).catch(() => {});

    res.json(annonce);
  } catch {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ─── POST /annonces — créer (auth) ────────────────────────────────────────────

annoncesRouter.post("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const result = createAnnonceSchema.safeParse(req.body);
    if (!result.success) { res.status(400).json({ error: result.error.flatten() }); return; }

    const { details, ...rest } = result.data;
    const annonce = await prisma.annonce.create({
      data: { ...rest, userId: req.user!.id, details: details as Prisma.InputJsonValue },
      select: annonceSelect,
    });

    res.status(201).json(annonce);
  } catch {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ─── PUT /annonces/:id — modifier (owner) ─────────────────────────────────────

annoncesRouter.put("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const existing = await prisma.annonce.findUnique({ where: { id: req.params.id } });
    if (!existing)                      { res.status(404).json({ error: "Annonce introuvable" }); return; }
    if (existing.userId !== req.user!.id) { res.status(403).json({ error: "Non autorisé" }); return; }

    const result = updateAnnonceSchema.safeParse(req.body);
    if (!result.success) { res.status(400).json({ error: result.error.flatten() }); return; }

    const { details, ...rest } = result.data;
    const annonce = await prisma.annonce.update({
      where: { id: req.params.id },
      data:  { ...rest, ...(details !== undefined && { details: details as Prisma.InputJsonValue }) },
      select: annonceSelect,
    });

    res.json(annonce);
  } catch {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ─── PATCH /annonces/:id/status — changer statut (owner) ──────────────────────

annoncesRouter.patch("/:id/status", requireAuth, async (req: AuthRequest, res) => {
  try {
    const existing = await prisma.annonce.findUnique({ where: { id: req.params.id } });
    if (!existing)                      { res.status(404).json({ error: "Annonce introuvable" }); return; }
    if (existing.userId !== req.user!.id) { res.status(403).json({ error: "Non autorisé" }); return; }

    const result = statusSchema.safeParse(req.body);
    if (!result.success) { res.status(400).json({ error: result.error.flatten() }); return; }

    const annonce = await prisma.annonce.update({
      where: { id: req.params.id },
      data:  { status: result.data.status },
      select: annonceSelect,
    });

    res.json(annonce);
  } catch {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ─── DELETE /annonces/:id — supprimer (owner) ─────────────────────────────────

annoncesRouter.delete("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const existing = await prisma.annonce.findUnique({ where: { id: req.params.id } });
    if (!existing)                      { res.status(404).json({ error: "Annonce introuvable" }); return; }
    if (existing.userId !== req.user!.id) { res.status(403).json({ error: "Non autorisé" }); return; }

    await prisma.annonce.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: "Erreur serveur" });
  }
});
