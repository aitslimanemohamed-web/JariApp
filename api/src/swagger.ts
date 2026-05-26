import swaggerJsdoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "JariApp API",
      version: "1.0.0",
      description: "API REST pour JariApp — Services entre voisins en Algérie",
    },
    servers: [{ url: "http://localhost:4000", description: "Local" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id:        { type: "string", format: "uuid" },
            email:     { type: "string", format: "email" },
            firstName: { type: "string" },
            lastName:  { type: "string" },
            role:      { type: "string", enum: ["CLIENT", "PRESTATAIRE"] },
            wilaya:    { type: "integer", minimum: 1, maximum: 58 },
          },
        },
        Category: {
          type: "object",
          properties: {
            id:     { type: "string", format: "uuid" },
            slug:   { type: "string" },
            nameFr: { type: "string" },
            nameAr: { type: "string" },
            nameEn: { type: "string" },
            icon:   { type: "string" },
          },
        },
        Service: {
          type: "object",
          properties: {
            id:          { type: "string", format: "uuid" },
            title:       { type: "string" },
            description: { type: "string" },
            price:       { type: "number" },
            wilaya:      { type: "integer" },
            isActive:    { type: "boolean" },
            provider:    { $ref: "#/components/schemas/User" },
            category:    { $ref: "#/components/schemas/Category" },
          },
        },
        Booking: {
          type: "object",
          properties: {
            id:          { type: "string", format: "uuid" },
            status:      { type: "string", enum: ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"] },
            scheduledAt: { type: "string", format: "date-time" },
            notes:       { type: "string" },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
      },
    },
    tags: [
      { name: "Auth",       description: "Authentification et gestion du compte" },
      { name: "Categories", description: "Catégories de services" },
      { name: "Services",   description: "Services proposés par les prestataires" },
      { name: "Bookings",   description: "Réservations" },
    ],
    paths: {
      "/health": {
        get: {
          summary: "Health check",
          tags: ["Auth"],
          responses: { "200": { description: "API opérationnelle" } },
        },
      },
      "/api/v1/auth/register": {
        post: {
          summary: "Créer un compte",
          tags: ["Auth"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password", "firstName", "lastName"],
                  properties: {
                    email:     { type: "string", format: "email", example: "user@jariapp.dz" },
                    password:  { type: "string", minLength: 6, example: "secret123" },
                    firstName: { type: "string", example: "Mohamed" },
                    lastName:  { type: "string", example: "Ait" },
                    phone:     { type: "string", example: "0555123456" },
                    role:      { type: "string", enum: ["CLIENT", "PRESTATAIRE"], default: "CLIENT" },
                    wilaya:    { type: "integer", minimum: 1, maximum: 58, example: 16 },
                  },
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Compte créé",
              content: { "application/json": { schema: {
                type: "object",
                properties: {
                  user:  { $ref: "#/components/schemas/User" },
                  token: { type: "string" },
                },
              }}},
            },
            "400": { description: "Données invalides" },
            "409": { description: "Email déjà utilisé" },
          },
        },
      },
      "/api/v1/auth/login": {
        post: {
          summary: "Se connecter",
          tags: ["Auth"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email:    { type: "string", format: "email", example: "test@jariapp.dz" },
                    password: { type: "string", example: "secret123" },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Connexion réussie",
              content: { "application/json": { schema: {
                type: "object",
                properties: {
                  user:  { $ref: "#/components/schemas/User" },
                  token: { type: "string" },
                },
              }}},
            },
            "401": { description: "Identifiants incorrects" },
          },
        },
      },
      "/api/v1/auth/me": {
        get: {
          summary: "Profil de l'utilisateur connecté",
          tags: ["Auth"],
          security: [{ bearerAuth: [] }],
          responses: {
            "200": { description: "Profil", content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } },
            "401": { description: "Non authentifié" },
          },
        },
      },
      "/api/v1/categories": {
        get: {
          summary: "Lister toutes les catégories",
          tags: ["Categories"],
          responses: {
            "200": {
              description: "Liste des catégories",
              content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Category" } } } },
            },
          },
        },
      },
      "/api/v1/services": {
        get: {
          summary: "Lister les services",
          tags: ["Services"],
          parameters: [
            { name: "wilaya",     in: "query", schema: { type: "integer" }, description: "Filtrer par wilaya" },
            { name: "categoryId", in: "query", schema: { type: "string"  }, description: "Filtrer par catégorie" },
            { name: "page",       in: "query", schema: { type: "integer", default: 1 } },
            { name: "limit",      in: "query", schema: { type: "integer", default: 20 } },
          ],
          responses: {
            "200": {
              description: "Liste paginée",
              content: { "application/json": { schema: {
                type: "object",
                properties: {
                  data:  { type: "array", items: { $ref: "#/components/schemas/Service" } },
                  total: { type: "integer" },
                  page:  { type: "integer" },
                  limit: { type: "integer" },
                },
              }}},
            },
          },
        },
        post: {
          summary: "Créer un service (prestataire)",
          tags: ["Services"],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["title", "wilaya", "categoryId"],
                  properties: {
                    title:       { type: "string", example: "Plombier expérimenté" },
                    description: { type: "string", example: "Intervention rapide, devis gratuit" },
                    price:       { type: "number", example: 2500 },
                    wilaya:      { type: "integer", example: 16 },
                    categoryId:  { type: "string", format: "uuid" },
                  },
                },
              },
            },
          },
          responses: {
            "201": { description: "Service créé" },
            "401": { description: "Non authentifié" },
          },
        },
      },
      "/api/v1/services/{id}": {
        get: {
          summary: "Détail d'un service",
          tags: ["Services"],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
          responses: {
            "200": { description: "Service", content: { "application/json": { schema: { $ref: "#/components/schemas/Service" } } } },
            "404": { description: "Service introuvable" },
          },
        },
      },
    },
  },
  apis: [],
});
