import { apiFetch } from "./client";

export async function listProducts() {
  return apiFetch("/shop/products");
}

export async function searchProducts(query) {
  return apiFetch(`/shop/products/search?q=${encodeURIComponent(query)}`);
}

export async function getProduct(productId) {
  return apiFetch(`/shop/products/${productId}`);
}

export async function createOrder(payload) {
  return apiFetch("/shop/orders", {
    method: "POST",
    body: payload,
  });
}

export async function getOrderHistory() {
  return apiFetch("/shop/orders");
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

export async function deleteProduct(id) {
  return apiFetch(`/shop/admin/products/${id}`, { method: "DELETE" });
}

export async function getAllOrders() {
  return apiFetch("/shop/admin/orders");
}
