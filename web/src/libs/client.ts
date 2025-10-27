export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const origin = process.env.BACKEND_ORIGIN!;
  const res = await fetch(`${origin}${path}`, { cache: "no-store", ...init });
  if (!res.ok) throw new Error(`API ${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}