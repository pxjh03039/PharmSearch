import { NextRequest, NextResponse } from "next/server";

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export const runtime = "nodejs"; // or "edge"도 가능(아래 fetch 옵션 주석 참고)

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Invalid 'prompt' in body" },
        { status: 400 }
      );
    }

    const apiKey = process.env.AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server misconfig: AI_API_KEY missing" },
        { status: 500 }
      );
    }

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 20_000);

    const resp = await fetch(`${GEMINI_ENDPOINT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
      signal: controller.signal,
    }).finally(() => clearTimeout(id));

    if (!resp.ok) {
      const err = await safeJson(resp);
      return NextResponse.json(
        { error: "Upstream error", detail: err || (await resp.text()) },
        { status: resp.status }
      );
    }

    const data = await resp.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      data?.candidates?.[0]?.content?.parts
        ?.map((p: any) => p?.text)
        .join("") ??
      "";

    return NextResponse.json(
      {
        text,
        raw: data, // 디버그가 필요 없으면 제거 가능
      },
      { status: 200 }
    );
  } catch (e: any) {
    const isAbort = e?.name === "AbortError";
    return NextResponse.json(
      {
        error: isAbort ? "Request timeout" : "Unexpected error",
        detail: e?.message ?? String(e),
      },
      { status: isAbort ? 504 : 500 }
    );
  }
}

async function safeJson(resp: Response) {
  try {
    return await resp.json();
  } catch {
    return null;
  }
}
