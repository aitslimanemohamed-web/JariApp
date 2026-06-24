const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erreur serveur");
  return data as T;
}

function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export type User = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  role: "CLIENT" | "PRESTATAIRE";
  wilaya?: number;
  avatarUrl?: string;
  providerProfile?: { onboardingDone: boolean } | null;
};

export type Category = {
  id: string;
  slug: string;
  nameFr: string;
  nameAr: string;
  nameEn: string;
  icon: string;
};

export type AuthResponse = { user: User; token: string };

// ─── Annonces ────────────────────────────────────────────────────────────────

export type AnnonceType   = "SERVICE" | "DEMANDE" | "VENTE" | "LOCATION" | "EMPLOI";
export type AnnonceStatus = "ACTIVE"  | "PAUSED"  | "CLOSED";

export type AnnonceDetails =
  | { disponibilite: "IMMEDIATE" | "RDV" | "PARTIEL" }          // SERVICE
  | { date_souhaitee: string | null; date_flexible: boolean }    // DEMANDE
  | { prix: number; negociable: boolean }                        // VENTE
  | { prix: number; unite: "heure" | "jour" | "semaine" | "mois" } // LOCATION
  | { sens: "RECRUTE" | "CANDIDATE"; type_contrat?: string };    // EMPLOI

export type Annonce = {
  id:          string;
  type:        AnnonceType;
  status:      AnnonceStatus;
  titre:       string;
  description: string;
  wilayaId:    number;
  wilayaName:  string;
  details:     AnnonceDetails;
  viewsCount:  number;
  createdAt:   string;
  updatedAt:   string;
  user:        Pick<User, "id" | "firstName" | "lastName" | "username" | "avatarUrl">;
  category:    Category | null;
};

export type AnnonceListResponse = {
  data:  Annonce[];
  total: number;
  page:  number;
  limit: number;
};

export type CreateAnnonceInput = {
  type:        AnnonceType;
  titre:       string;
  description: string;
  wilayaId:    number;
  wilayaName:  string;
  categoryId?: string;
  details:     Record<string, unknown>;
};

export const api = {
  auth: {
    register: (body: {
      username: string; password: string;
      firstName: string; lastName: string;
      phone?: string; role: "CLIENT" | "PRESTATAIRE"; wilaya?: number;
    }) => request<AuthResponse>("/api/v1/auth/register", { method: "POST", body: JSON.stringify(body) }),

    login: (body: { username: string; password: string }) =>
      request<AuthResponse>("/api/v1/auth/login", { method: "POST", body: JSON.stringify(body) }),

    me: (token: string) =>
      request<User>("/api/v1/auth/me", { headers: authHeader(token) }),
  },

  categories: {
    list: () => request<Category[]>("/api/v1/categories"),
  },

  providers: {
    saveCategories: (categoryIds: string[], token: string) =>
      request<{ ok: boolean }>("/api/v1/providers/onboarding/categories", {
        method: "POST",
        headers: authHeader(token),
        body: JSON.stringify({ categoryIds }),
      }),

    saveProfile: (data: { bio: string; experienceYears: number; phone?: string }, token: string) =>
      request<{ ok: boolean; onboardingDone: boolean }>("/api/v1/providers/onboarding/profile", {
        method: "POST",
        headers: authHeader(token),
        body: JSON.stringify(data),
      }),

    getMe: (token: string) =>
      request<User>("/api/v1/providers/me", { headers: authHeader(token) }),
  },

  annonces: {
    list: (params?: { type?: AnnonceType; wilaya?: number; categoryId?: string; q?: string; page?: number }) => {
      const qs = new URLSearchParams();
      if (params?.type)       qs.set("type",       params.type);
      if (params?.wilaya)     qs.set("wilaya",      String(params.wilaya));
      if (params?.categoryId) qs.set("categoryId",  params.categoryId);
      if (params?.q)          qs.set("q",           params.q);
      if (params?.page)       qs.set("page",        String(params.page));
      return request<AnnonceListResponse>(`/api/v1/annonces?${qs}`);
    },

    me: (token: string, params?: { type?: AnnonceType; status?: AnnonceStatus }) => {
      const qs = new URLSearchParams();
      if (params?.type)   qs.set("type",   params.type);
      if (params?.status) qs.set("status", params.status);
      return request<Annonce[]>(`/api/v1/annonces/me?${qs}`, { headers: authHeader(token) });
    },

    get: (id: string) =>
      request<Annonce>(`/api/v1/annonces/${id}`),

    create: (body: CreateAnnonceInput, token: string) =>
      request<Annonce>("/api/v1/annonces", {
        method: "POST",
        headers: authHeader(token),
        body: JSON.stringify(body),
      }),

    update: (id: string, body: Partial<Omit<CreateAnnonceInput, "type">>, token: string) =>
      request<Annonce>(`/api/v1/annonces/${id}`, {
        method: "PUT",
        headers: authHeader(token),
        body: JSON.stringify(body),
      }),

    setStatus: (id: string, status: AnnonceStatus, token: string) =>
      request<Annonce>(`/api/v1/annonces/${id}/status`, {
        method: "PATCH",
        headers: authHeader(token),
        body: JSON.stringify({ status }),
      }),

    delete: (id: string, token: string) =>
      request<void>(`/api/v1/annonces/${id}`, {
        method: "DELETE",
        headers: authHeader(token),
      }),
  },
};
