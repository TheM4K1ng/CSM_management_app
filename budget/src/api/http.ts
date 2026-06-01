// const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";
const API_BASE = "http://localhost:8000/api";

console.log("API_BASE =", API_BASE);

export async function apiGet<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${path}`;

  console.log("FETCHING:", url);

  try {
    const res = await fetch(url, {
      ...init,
      headers: {
        Accept: "application/json",
        ...(init.headers || {}),
      },
    });

    console.log("RESPONSE:", url, res.status);

    if (!res.ok) {
      const text = await res.text();
      console.error("FAILED:", url, text);
      throw new Error(`${res.status} ${res.statusText}: ${text}`);
    }

    const data = await res.json();

    console.log("DATA:", data);

    return data as T;
  } catch (err) {
    console.error("FETCH ERROR FULL:", err);
    throw err;
  }
}

export async function apiPost<TResponse, TBody = unknown>(
  path: string,
  body: TBody,
  init: RequestInit = {}
): Promise<TResponse> {
  const url = `${API_BASE}${path}`;

  console.log("POSTING:", url, body);

  let res: Response;

  try {
    res = await fetch(url, {
      ...init,
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(init.headers || {}),
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error("POST ERROR:", url, err);
    throw err;
  }

  console.log("POST RESPONSE:", url, res.status);

  if (!res.ok) {
    const text = await res.text();
    console.error("POST FAILED:", url, text);
    throw new Error(`${res.status} ${res.statusText}: ${text}`);
  }

  return (await res.json()) as TResponse;
}

export async function apiDelete<TResponse = void>(
  path: string,
  init: RequestInit = {}
): Promise<TResponse> {
  const url = `${API_BASE}${path}`;

  console.log("DELETING:", url);

  let res: Response;

  try {
    res = await fetch(url, {
      ...init,
      method: "DELETE",
      headers: {
        Accept: "application/json",
        ...(init.headers || {}),
      },
    });
  } catch (err) {
    console.error("DELETE ERROR:", url, err);
    throw err;
  }

  console.log("DELETE RESPONSE:", url, res.status);

  if (!res.ok) {
    const text = await res.text();
    console.error("DELETE FAILED:", url, text);
    throw new Error(`${res.status} ${res.statusText}: ${text}`);
  }

  if (res.status === 204) {
    return undefined as TResponse;
  }

  return (await res.json()) as TResponse;
}