export interface User {
  id: number;
  email: string;
  role: "TRAINER" | "CLIENT";
  profile?: any;
}

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(endpoint, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.error || errorData.message || `Request failed (${res.status})`,
    );
  }

  // Handle empty responses
  if (res.status === 204) {
    return null;
  }

  return res.json();
}

export const apiGet = (endpoint: string) => apiFetch(endpoint);

export const apiPost = (endpoint: string, body?: any) =>
  apiFetch(endpoint, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });

export const apiPatch = (endpoint: string, body: any) =>
  apiFetch(endpoint, {
    method: "PATCH",
    body: JSON.stringify(body),
  });

export const apiDelete = (endpoint: string) =>
  apiFetch(endpoint, {
    method: "DELETE",
  });
