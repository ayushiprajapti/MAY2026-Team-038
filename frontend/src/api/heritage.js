import { apiFetch } from "./client";

export async function listPending(status = "pending_review") {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return apiFetch(`/admin/heritage-submissions${query}`);
}

export async function get(id) {
  return apiFetch(`/admin/heritage-submissions/${id}`);
}

export async function approve(id, reviewNotes) {
  return apiFetch(`/admin/heritage-submissions/${id}/approve`, {
    method: "PATCH",
    body: { review_notes: reviewNotes ?? null },
  });
}

export async function reject(id, reviewNotes) {
  return apiFetch(`/admin/heritage-submissions/${id}/reject`, {
    method: "PATCH",
    body: { review_notes: reviewNotes ?? null },
  });
}

export async function remove(id) {
  return apiFetch(`/admin/heritage-submissions/${id}`, { method: "DELETE" });
}
