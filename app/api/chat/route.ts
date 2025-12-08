import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/app/lib/prisma";

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export const runtime = "nodejs";

type Message = {
  id: string;
  role: "user" | "model";
  content: string;
  createdAt: string;
};

export async function POST(req: NextRequest) {
  try {
    const { prompt, userLocation } = await req.json();
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

    // 🔥 안전한 메시지 파싱
    let allMessages: Message[] = [];

    if (conversation?.messages) {
      // JSON 타입일 수 있으므로 타입 확인
      if (typeof conversation.messages === "string") {
        try {
          const trimmed = conversation.messages.trim();
          if (trimmed === "" || trimmed === "null") {
            allMessages = [];
          } else {
            allMessages = JSON.parse(trimmed);
          }
        } catch (e) {
          console.error("❌ [Gemini] 메시지 파싱 실패:", e);
          allMessages = [];
        }
      } else if (Array.isArray(conversation.messages)) {
        // 이미 배열인 경우 (Prisma가 자동 파싱한 경우)
        allMessages = conversation.messages as Message[];
      } else {
        console.error(
          "❌ [Gemini] 예상치 못한 타입:",
          typeof conversation.messages
        );
        allMessages = [];
      }
    }

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

async function safeJson(resp: Response) {
  try {
    return await resp.json();
  } catch {
    return null;
  }
}
