import { apiFetch } from "./client";

export async function getShopStats() {
  return apiFetch("/admin/dashboard/shop-stats");
}

export async function getEvents() {
  return apiFetch("/admin/dashboard/events");
}

export async function getRecentUploads() {
  return apiFetch("/admin/dashboard/recent-volunteers");
}

export async function getMemberStats() {
  return apiFetch("/admin/dashboard/member-stats");
}

export async function getSalesTrend(months = 6) {
  return apiFetch(`/admin/dashboard/sales-trend?months=${months}`);
}
