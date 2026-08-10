import { apiFetch, setToken, clearAuth } from "./client";

export async function login(email, password) {
  const data = await apiFetch("/auth/login", {
    method: "POST",
    body: { email, password },
  });
  setToken(data.access_token);

  const user = await apiFetch("/auth/me");
  localStorage.setItem("intach_user", JSON.stringify(user));
  return user;
}

export async function signup(fullName, email, password, phone) {
  return apiFetch("/auth/signup", {
    method: "POST",
    body: { full_name: fullName, email, password, phone: phone || null },
  });
}

export async function getMe() {
  return apiFetch("/auth/me");
}

export async function updateMe(payload) {
  return apiFetch("/auth/me", {
    method: "PATCH",
    body: payload,
  });
}

export function logout() {
  clearAuth();
}
