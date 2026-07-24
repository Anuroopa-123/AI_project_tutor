// Lightweight auth helpers. The backend still enforces real auth on every
// request via the Bearer token — this decode is only for UI convenience
// (showing name/role without an extra round trip).

export type StoredUser = {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "TEACHER" | "STUDENT";
};

const ACCESS_KEY = "edusense_access_token";
const REFRESH_KEY = "edusense_refresh_token";
const USER_KEY = "edusense_user";

export function saveSession(accessToken: string, refreshToken: string, user: StoredUser) {
  localStorage.setItem(ACCESS_KEY, accessToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_KEY);
}

export function getStoredUser(): StoredUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearSession() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
}

export function roleHomePath(role: StoredUser["role"]): string {
  switch (role) {
    case "SUPER_ADMIN": return "/super-admin/superadmindashboard";
    case "ADMIN": return "/admin/dashboard";
    case "TEACHER": return "/teacher/dashboard";
    case "STUDENT": return "/student/dashboard";
    default: return "/";
  }
}

// Authenticated fetch — attaches the Bearer token automatically.
export async function authFetch(input: string, init: RequestInit = {}) {
  const token = getAccessToken();
  return fetch(input, {
    ...init,
    headers: {
      ...(init.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}