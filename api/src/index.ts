import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";
import { authRouter } from "./routes/auth";
import { categoriesRouter } from "./routes/categories";
import { servicesRouter } from "./routes/services";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: ["http://localhost:3002", "http://localhost:8081"] }));
app.use(express.json());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: "JariApp API Docs",
  customCss: ".swagger-ui .topbar { background-color: #1B4F72; } .swagger-ui .topbar-wrapper img { content: none; } .swagger-ui .topbar-wrapper::after { content: 'JariApp API'; color: white; font-weight: 700; font-size: 1.2rem; }",
}));

app.get("/health", (_, res) => res.json({ status: "ok", app: "jariapp-api" }));

app.use("/api/v1/auth",       authRouter);
app.use("/api/v1/categories", categoriesRouter);
app.use("/api/v1/services",   servicesRouter);

app.listen(PORT, () => {
  console.log(`API JariApp    → http://localhost:${PORT}`);
  console.log(`Documentation  → http://localhost:${PORT}/docs`);
});
