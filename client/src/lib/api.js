const API_URL = import.meta.env.VITE_API_URL || "/api";

export function getToken() {
  return localStorage.getItem("opencharity_token");
}

export function setSession(token, user) {
  localStorage.setItem("opencharity_token", token);
  localStorage.setItem("opencharity_user", JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem("opencharity_token");
  localStorage.removeItem("opencharity_user");
}

export function getStoredUser() {
  const raw = localStorage.getItem("opencharity_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    body: options.body && typeof options.body !== "string" ? JSON.stringify(options.body) : options.body
  });

  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = response.ok ? text : null;
    }
  }

  if (!response.ok) {
    throw new Error(data?.message || "Không thể kết nối API OpenCharity.");
  }

  return data;
}
