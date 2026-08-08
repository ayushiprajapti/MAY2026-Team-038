const API_BASE_URL = "http://127.0.0.1:8000";

async function handleResponse(response) {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.detail || `Request failed with status ${response.status}`
    );
  }

  return data;
}

export async function getProducts() {
  const response = await fetch(`${API_BASE_URL}/shop/products`);
  return handleResponse(response);
}

export async function searchProducts(query) {
  const response = await fetch(
    `${API_BASE_URL}/shop/products/search?q=${encodeURIComponent(query)}`
  );

  return handleResponse(response);
}

export async function getProduct(productId) {
  const response = await fetch(
    `${API_BASE_URL}/shop/products/${productId}`
  );

  return handleResponse(response);
}

export async function createOrder(orderData, accessToken) {
  const response = await fetch(`${API_BASE_URL}/shop/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(orderData),
  });

  return handleResponse(response);
}

export async function getOrderHistory(accessToken) {
  const response = await fetch(`${API_BASE_URL}/shop/orders`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return handleResponse(response);
}