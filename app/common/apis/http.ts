// lib/api/http.ts
const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";
// 지금은 "" (동일 도메인 /api 사용).
// 나중에 백엔드 분리 시 "https://api.example.com" 만 설정하면 됩니다.

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RequestOptions = {
  params?: Record<string, any>;
  body?: any;
  headers?: Record<string, string>;
  timeoutMs?: number;
};

export class ApiError extends Error {
  status: number;
  data?: any;
  constructor(message: string, status: number, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

function toQuery(params?: Record<string, any>) {
  if (!params) return "";
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    q.append(k, String(v));
  });
  const qs = q.toString();
  return qs ? `?${qs}` : "";
}

export async function api<T>(
  path: string,
  method: Method = "GET",
  { params, body, headers, timeoutMs = 15000 }: RequestOptions = {}
): Promise<T> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const url = `${API_BASE}${path}${toQuery(params)}`;
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: method === "GET" ? undefined : JSON.stringify(body ?? {}),
      cache: "no-store",
      signal: controller.signal,
    });

    const text = await res.text();
    const json = text ? JSON.parse(text) : null;

    if (!res.ok) {
      throw new ApiError(json?.error ?? "API Error", res.status, json);
    }
    return json as T;
  } finally {
    clearTimeout(t);
  }
}
