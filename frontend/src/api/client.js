const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const TOKEN_KEY = "intach_token";
const USER_KEY = "intach_user";

export class ApiError extends Error {
  constructor(status, detail) {
    super(detail || `Request failed with status ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = { ...(options.headers || {}) };

  let body = options.body;
  if (body !== undefined && body !== null) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(body);
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body,
  });

  if (response.status === 401) {
    clearAuth();
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
    throw new ApiError(401, "Session expired. Please log in again.");
  }

  if (!response.ok) {
    let detail = `Request failed with status ${response.status}`;
    try {
      const data = await response.json();
      if (data && data.detail) {
        // FastAPI's own HTTPException(detail=...) gives a string, but
        // Pydantic validation errors (422) give an array of
        // {type, loc, msg, ...} objects instead — normalize both to a
        // plain string so callers can always render it directly.
        detail = Array.isArray(data.detail)
          ? data.detail.map((item) => item.msg || JSON.stringify(item)).join("; ")
          : typeof data.detail === "string"
          ? data.detail
          : JSON.stringify(data.detail);
      }
    } catch {
      // response body wasn't JSON — keep the generic message
    }
    throw new ApiError(response.status, detail);
  }

  if (response.status === 204) return null;

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}
