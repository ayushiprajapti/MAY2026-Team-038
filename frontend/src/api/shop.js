import { apiFetch } from "./client";

export async function listProducts() {
  return apiFetch("/shop/products");
}

export async function createProduct(payload) {
  return apiFetch("/shop/admin/products", {
    method: "POST",
    body: payload,
  });
}

export async function updateProduct(id, payload) {
  return apiFetch(`/shop/admin/products/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export async function getAllOrders() {
  return apiFetch("/shop/admin/orders");
}
