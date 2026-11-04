export async function api<T = any>(url: string, init?: RequestInit & { json?: unknown }): Promise<{ ok: boolean; status: number; data: T }> {
  const headers: Record<string, string> = {};
  let body = init?.body;
  if (init?.json !== undefined) { headers["Content-Type"] = "application/json"; body = JSON.stringify(init.json); }
  const res = await fetch(url, { ...init, headers: { ...headers, ...(init?.headers as object) }, body, credentials: "same-origin" });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}
