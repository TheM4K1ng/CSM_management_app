const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export async function getUnitOrg<T>(unitId: number | string): Promise<T> {
  const res = await fetch(`${API_BASE}/units/${unitId}/org/`, {
    headers: { "Accept": "application/json" },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${text}`);
  }
  return res.json() as Promise<T>;
}
