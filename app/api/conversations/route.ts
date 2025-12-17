// app/api/conversations/route.ts (또는 해당 경로)
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { HTTP_STATUS_CODE } from "@/app/common/apis/constants/http";
import { parseConversationMessages } from "@/app/lib/conversationMessages";

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

// GET: 대화 조회
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "인증되지 않은 사용자입니다." },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

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

    return NextResponse.json({
      id: conversation.id,
      userId: conversation.userId,
      messages: messages, // 파싱된 배열
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    });
  } catch (error) {
    console.error("대화 조회 실패:", error);
    return NextResponse.json(
      { error: "대화 조회에 실패했습니다." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "인증되지 않은 사용자입니다." },
        { status: HTTP_STATUS_CODE.UNAUTHORIZED }
      );
    }

    const user = await findOrCreateUser(session.user.email, session.user.name);

    await prisma.conversation.upsert({
      where: { userId: user.id },
      create: { userId: user.id, messages: [] },
      update: { messages: [] },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("대화 삭제 실패:", error);
    return NextResponse.json(
      { error: "대화 삭제에 실패했습니다." },
      { status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR }
    );
  }
}
