import { apiFetch } from "./client";

export async function listPending({ status = "pending_review", category = null, regionId = null, page = 1, pageSize = 10 } = {}) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (category) params.set("category", category);
  if (regionId) params.set("region_id", regionId);
  params.set("page", page);
  params.set("page_size", pageSize);
  return apiFetch(`/admin/heritage-submissions?${params.toString()}`);
}

export async function listRegions() {
  return apiFetch("/admin/heritage-submissions/regions");
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
