import { apiFetch } from "./client";

export async function list() {
  return apiFetch("/events/admin/");
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
