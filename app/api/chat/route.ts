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

    const systemPrompt = `
      너는 약품과 질병 증상만 답변하는 의약정보 챗봇이다.

      📋 답변 규칙:
      1. 화면 폭은 216px로 제한된다. 한 줄에 약 18~22자 내외로 줄바꿈(\n)을 추가해라.
      2. 약이 여러 개일 경우, 리스트 형식으로 정리해라.
        예: 
        - 타이레놀: 경증 통증 완화
        - 이부프로펜: 염증성 통증 완화
      3. 불필요한 문장이나 장문 설명은 생략하고, 짧고 명확하게 말해라.
      4. 꼭 아래 형식을 유지해라:

      💊 *추천 약*
      - 약이름: 한 줄 설명 (줄이 길면 자연스러운 지점에서 줄바꿈)

      ⚠️ *주의사항*
      - 핵심만 1~3줄로 요약
      - 약품에 대해 질문시 부작용이나 가격 등등 부가적인 정보는 대답   
      그 외 주제(날씨, 일상 등)는 "의약 관련 질문만 답변할 수 있습니다."라고 답해라.
      `;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 20_000);

    const resp = await fetch(`${GEMINI_ENDPOINT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: systemPrompt }] },
          { role: "user", parts: [{ text: prompt }] },
        ],
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
