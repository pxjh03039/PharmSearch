import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { parseConversationMessages } from "@/app/lib/conversationMessages";
import type { Message } from "@/app/common/types/constants";

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export const runtime = "nodejs";

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

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // User 찾기
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 대화 히스토리 가져오기
    const conversation = await prisma.conversation.findUnique({
      where: { userId: user.id },
    });

    const allMessages: Message[] = parseConversationMessages(
      conversation?.messages
    );

    // 최근 20개 메시지만 사용 (10턴)
    const recentMessages = allMessages.slice(-20);

    // Gemini 형식으로 변환
    const history = recentMessages.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.content }],
    }));

    const systemPrompt = `당신은 약국 찾기 앱의 간결한 AI 어시스턴트입니다.

    [핵심 규칙]
    - 답변은 짧고 명확하게 (전체 3-4문장 이내)
    - 불필요한 설명이나 반복 없이 핵심만 전달
    - 복잡한 증상은 즉시 병원 방문 권장

    [답변 형식]
    1. 추천 약 (리스트 형태로 1-3개, 제품명 + 간단한 설명)
    2. 주의사항 (1문장, 필요시에만)

    [예시 - 증상 질문]
    사용자: "머리 아파요"
    AI: "두통이시군요. 다음 약을 추천드립니다.

    - 타이레놀: 순한 진통제, 공복 복용 가능
    - 게보린: 카페인 함유로 효과 빠름

    3일 이상 지속되면 병원 방문하세요."

    이전 대화를 참고하되, 매번 간결하게 답변하세요.`;

    const contents = [
      { role: "user", parts: [{ text: systemPrompt }] },
      ...history,
      { role: "user", parts: [{ text: prompt }] },
    ];

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 20_000);

    const resp = await fetch(`${GEMINI_ENDPOINT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({ contents }),
      signal: controller.signal,
    }).finally(() => clearTimeout(id));

    if (!resp.ok) {
      const { json, text } = await readJsonOrText(resp);
      const upstreamMessage = extractUpstreamMessage(json);
      const errorMessage = toUserFacingUpstreamError(
        resp.status,
        upstreamMessage
      );

      const retryAfterSeconds = parseRetryAfterSeconds(
        resp.headers.get("retry-after")
      );
      const headers: HeadersInit = {};
      if (retryAfterSeconds !== null) {
        headers["Retry-After"] = String(retryAfterSeconds);
      }

      return NextResponse.json(
        {
          error: errorMessage,
          code: resp.status === 429 ? "RATE_LIMITED" : "UPSTREAM_ERROR",
          retryAfterSeconds,
          upstreamMessage,
          detail: json ?? text,
        },
        { status: resp.status, headers }
      );
    }

    const data = await resp.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      data?.candidates?.[0]?.content?.parts
        ?.map((p: any) => p?.text)
        .join("") ??
      "";

    return NextResponse.json({ text, raw: data }, { status: 200 });
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

function extractUpstreamMessage(json: unknown): string | null {
  if (!json || typeof json !== "object") return null;

  const candidate = json as any;
  if (typeof candidate?.error?.message === "string") return candidate.error.message;
  if (typeof candidate?.message === "string") return candidate.message;

  return null;
}

function toUserFacingUpstreamError(
  status: number,
  upstreamMessage: string | null
) {
  if (status === 429) {
    return "AI 요청이 많아 일시적으로 제한되었습니다. 잠시 후 다시 시도해주세요.";
  }

  if (status === 403) {
    return "AI API 키/권한 설정을 확인해주세요.";
  }

  if (upstreamMessage) {
    return `AI 서버 오류: ${upstreamMessage} (${status})`;
  }

  return `AI 서버 오류 (${status})`;
}

function parseRetryAfterSeconds(headerValue: string | null): number | null {
  if (!headerValue) return null;

  const seconds = Number.parseInt(headerValue, 10);
  if (!Number.isFinite(seconds) || seconds <= 0) return null;

  return seconds;
}

async function readJsonOrText(resp: Response): Promise<{
  json: unknown | null;
  text: string | null;
}> {
  try {
    const text = await resp.text();
    if (!text) return { json: null, text: "" };

    try {
      return { json: JSON.parse(text), text };
    } catch {
      return { json: null, text };
    }
  } catch {
    return { json: null, text: null };
  }
}
