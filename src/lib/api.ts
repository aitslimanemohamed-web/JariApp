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
};
