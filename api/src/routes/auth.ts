import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const authRouter = Router();

const registerSchema = z.object({
  username:  z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/, "Lettres, chiffres et _ uniquement"),
  password:  z.string().min(6),
  firstName: z.string().min(2),
  lastName:  z.string().min(2),
  phone:     z.string().optional(),
  role:      z.enum(["CLIENT", "PRESTATAIRE"]).default("CLIENT"),
  wilaya:    z.number().int().min(1).max(58).optional(),
});

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

const userSelect = {
  id: true, username: true, firstName: true,
  lastName: true, role: true, wilaya: true, avatarUrl: true,
};

authRouter.post("/register", async (req, res) => {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) { res.status(400).json({ error: result.error.flatten() }); return; }

  const { username, password, firstName, lastName, phone, role, wilaya } = result.data;

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) { res.status(409).json({ error: "Nom d'utilisateur déjà pris" }); return; }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { username, passwordHash, firstName, lastName, phone, role, wilaya },
    select: userSelect,
  });

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  res.status(201).json({ user, token });
});

authRouter.post("/login", async (req, res) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) { res.status(400).json({ error: result.error.flatten() }); return; }

  const { username, password } = result.data;
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    res.status(401).json({ error: "Nom d'utilisateur ou mot de passe incorrect" });
    return;
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  res.json({ user: { id: user.id, username: user.username, firstName: user.firstName, lastName: user.lastName, role: user.role }, token });
});

authRouter.get("/me", async (req, res) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) { res.status(401).json({ error: "Non autorisé" }); return; }
  try {
    const { userId } = jwt.verify(header.slice(7), process.env.JWT_SECRET!) as { userId: string };
    const user = await prisma.user.findUnique({ where: { id: userId }, select: userSelect });
    if (!user) { res.status(404).json({ error: "Utilisateur introuvable" }); return; }
    res.json(user);
  } catch {
    res.status(401).json({ error: "Token invalide" });
  }
});
