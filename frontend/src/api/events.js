import { apiFetch, apiFetchForm } from "./client";

export async function list() {
  return apiFetch("/events/admin/");
}

export async function uploadEventImage(file) {
  const form = new FormData();
  form.append("file", file);
  return apiFetchForm("/events/admin/upload-image", form);
}

export async function create(payload) {
  return apiFetch("/events/admin/", {
    method: "POST",
    body: payload,
  });
}

export async function update(id, payload) {
  return apiFetch(`/events/admin/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export async function remove(id) {
  return apiFetch(`/events/admin/${id}`, { method: "DELETE" });
}

export async function listRegistrants(id) {
  return apiFetch(`/events/admin/${id}/registrations`);
}

// ── Public / signed-in user endpoints ─────────────────────────────────────

export async function listUpcoming(eventType) {
  const query = eventType ? `?type=${encodeURIComponent(eventType)}` : "";
  return apiFetch(`/events/${query}`);
}

export async function registerForEvent(id, payload) {
  return apiFetch(`/events/${id}/register`, {
    method: "POST",
    body: payload,
  });
}

export async function revokeRegistration(id) {
  return apiFetch(`/events/${id}/register`, { method: "DELETE" });
}

export async function myHistory() {
  return apiFetch("/events/my-history");
}
