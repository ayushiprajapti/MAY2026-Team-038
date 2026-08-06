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
