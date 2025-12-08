import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { HTTP_STATUS_CODE } from "@/app/common/apis/constants/http";

type Message = {
  id: string;
  role: "user" | "model";
  content: string;
  createdAt: string;
};

async function findOrCreateUser(email: string, name?: string | null) {
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({
      data: { email, name: name || null },
    });
  }
  return user;
}

// 메시지 추가
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "인증되지 않은 사용자입니다." },
        { status: HTTP_STATUS_CODE.UNAUTHORIZED }
      );
    }

    const { content, role } = await req.json();
    if (!content || !role) {
      return NextResponse.json(
        { error: "content와 role은 필수입니다." },
        { status: HTTP_STATUS_CODE.BAD_REQUEST }
      );
    }

    const user = await findOrCreateUser(session.user.email, session.user.name);

    let conversation = await prisma.conversation.findUnique({
      where: { userId: user.id },
    });

    // 대화가 없으면 생성
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          userId: user.id,
          messages: JSON.stringify([]),
        },
      });
    }

    // 🔥 안전한 메시지 파싱
    let messages: Message[] = [];

    if (conversation.messages) {
      // JSON 타입일 수 있으므로 타입 확인
      if (typeof conversation.messages === "string") {
        try {
          const trimmed = conversation.messages.trim();
          if (trimmed === "" || trimmed === "null") {
            console.log("⚠️ 빈 문자열 또는 null, 빈 배열로 초기화");
            messages = [];
          } else {
            messages = JSON.parse(trimmed);
          }
        } catch (e) {
          console.error("메시지 파싱 실패:", e);
          console.log("저장된 값:", conversation.messages);
          messages = [];
        }
      } else if (Array.isArray(conversation.messages)) {
        // 이미 배열인 경우 (Prisma가 자동 파싱한 경우)
        messages = conversation.messages as Message[];
      } else {
        console.error("예상치 못한 타입:", typeof conversation.messages);
        messages = [];
      }
    }

    // 새 메시지 추가
    const newMessage: Message = {
      id: crypto.randomUUID(),
      role,
      content,
      createdAt: new Date().toISOString(),
    };
    messages.push(newMessage);

    // 대화 업데이트
    await prisma.conversation.update({
      where: { userId: user.id },
      data: {
        messages: JSON.stringify(messages),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(newMessage);
  } catch (error) {
    console.error("메시지 추가 실패:", error);
    return NextResponse.json(
      { error: "메시지 추가에 실패했습니다." },
      { status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR }
    );
  }
}
