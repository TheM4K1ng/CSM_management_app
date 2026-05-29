// const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";
const API_BASE = "http://localhost:8000";
console.log("API_BASE =", API_BASE);

export async function apiGet<T>(path: string, init: RequestInit = {}): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        ...init,
        headers: {Accept: "application/json", ...(init.headers || {})},
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`${res.status} ${res.statusText}: ${text}`);
    }

    return (await res.json()) as T;
}

export async function apiPost<TResponse, TBody = unknown>(
  path: string,
  body: TBody,
  init: RequestInit = {}
): Promise<TResponse> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${text}`);
  }

  return (await res.json()) as TResponse;
}

export async function apiDelete<TResponse = void>(
  path: string,
  init: RequestInit = {}
): Promise<TResponse> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    method: "DELETE",
    headers: {
      Accept: "application/json",
      ...(init.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${text}`);
  }

  // DRF often returns empty body on DELETE
  if (res.status === 204) {
    return undefined as TResponse;
  }

  return (await res.json()) as TResponse;
}