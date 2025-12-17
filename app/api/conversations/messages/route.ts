import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { HTTP_STATUS_CODE } from "@/app/common/apis/constants/http";
import { parseConversationMessages } from "@/app/lib/conversationMessages";
import type { Message } from "@/app/common/types/constants";

export const runtime = "nodejs";

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
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "인증되지 않은 사용자입니다." },
        { status: HTTP_STATUS_CODE.UNAUTHORIZED }
      );
    }

    const { content, role } = await req.json();
    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "content는 필수입니다." },
        { status: HTTP_STATUS_CODE.BAD_REQUEST }
      );
    }

    if (role !== "user" && role !== "model") {
      return NextResponse.json(
        { error: "role은 user | model 이어야 합니다." },
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
          messages: [],
        },
      });
    }

    const messages = parseConversationMessages(conversation.messages);

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
        messages,
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
