import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const authRouter = Router();

const registerSchema = z.object({
  email:     z.string().email(),
  password:  z.string().min(6),
  firstName: z.string().min(2),
  lastName:  z.string().min(2),
  phone:     z.string().optional(),
  role:      z.enum(["CLIENT", "PRESTATAIRE"]).default("CLIENT"),
  wilaya:    z.number().int().min(1).max(58).optional(),
});

const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string(),
});

authRouter.post("/register", async (req, res) => {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.flatten() });
    return;
  }
  const { email, password, firstName, lastName, phone, role, wilaya } = result.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(409).json({ error: "Email déjà utilisé" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, passwordHash, firstName, lastName, phone, role, wilaya },
    select: { id: true, email: true, firstName: true, lastName: true, role: true },
  });

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  res.status(201).json({ user, token });
});

authRouter.post("/login", async (req, res) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.flatten() });
    return;
  }
  const { email, password } = result.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    res.status(401).json({ error: "Email ou mot de passe incorrect" });
    return;
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  res.json({
    user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
    token,
  });
});

authRouter.get("/me", async (req, res) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) { res.status(401).json({ error: "Non autorisé" }); return; }
  try {
    const { userId } = jwt.verify(header.slice(7), process.env.JWT_SECRET!) as { userId: string };
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, wilaya: true, avatarUrl: true },
    });
    if (!user) { res.status(404).json({ error: "Utilisateur introuvable" }); return; }
    res.json(user);
  } catch {
    res.status(401).json({ error: "Token invalide" });
  }
});
