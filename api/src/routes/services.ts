import { Router } from "express";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { requireAuth, AuthRequest } from "../middleware/auth";

const prisma = new PrismaClient();
export const servicesRouter = Router();

const serviceSchema = z.object({
  title:       z.string().min(3),
  description: z.string().optional(),
  price:       z.number().positive().optional(),
  wilaya:      z.number().int().min(1).max(58),
  categoryId:  z.string().uuid(),
});

servicesRouter.get("/", async (req, res) => {
  const { wilaya, categoryId, page = "1", limit = "20" } = req.query;
  const where: Record<string, unknown> = { isActive: true };
  if (wilaya)     where.wilaya     = Number(wilaya);
  if (categoryId) where.categoryId = categoryId;

  const [services, total] = await Promise.all([
    prisma.service.findMany({
      where,
      include: {
        provider: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
        category: { select: { id: true, nameFr: true, nameAr: true, nameEn: true, icon: true } },
      },
      orderBy: { createdAt: "desc" },
      skip:  (Number(page) - 1) * Number(limit),
      take:  Number(limit),
    }),
    prisma.service.count({ where }),
  ]);

  res.json({ data: services, total, page: Number(page), limit: Number(limit) });
});

servicesRouter.post("/", requireAuth, async (req: AuthRequest, res) => {
  const result = serviceSchema.safeParse(req.body);
  if (!result.success) { res.status(400).json({ error: result.error.flatten() }); return; }

  const service = await prisma.service.create({
    data: { ...result.data, providerId: req.userId! },
    include: { category: true },
  });
  res.status(201).json(service);
});

servicesRouter.get("/:id", async (req, res) => {
  const service = await prisma.service.findUnique({
    where: { id: req.params.id },
    include: {
      provider: { select: { id: true, firstName: true, lastName: true, avatarUrl: true, wilaya: true } },
      category: true,
    },
  });
  if (!service) { res.status(404).json({ error: "Service introuvable" }); return; }
  res.json(service);
});
