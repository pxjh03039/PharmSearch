// app/api/conversations/route.ts (또는 해당 경로)
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/app/lib/prisma";
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

// GET: 대화 조회
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
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
          messages: JSON.stringify([]),
        },
      });
    }

    // 🔥 안전한 메시지 파싱
    let messages: Message[] = [];

    if (conversation.messages) {
      if (typeof conversation.messages === "string") {
        try {
          const trimmed = conversation.messages.trim();
          if (trimmed && trimmed !== "null" && trimmed !== "") {
            messages = JSON.parse(trimmed);
          }
        } catch (e) {
          console.error("❌ [GET] 메시지 파싱 실패:", e);
          console.log("저장된 값:", conversation.messages);
          messages = [];
        }
      } else if (Array.isArray(conversation.messages)) {
        messages = conversation.messages as Message[];
      }
    }

    console.log(
      `📖 [대화 조회] 사용자: ${user.email}, 메시지 수: ${messages.length}`
    );

    // 🔥 반드시 파싱된 배열을 반환
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

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "인증되지 않은 사용자입니다." },
        { status: HTTP_STATUS_CODE.UNAUTHORIZED }
      );
    }

    const user = await findOrCreateUser(session.user.email, session.user.name);

    await prisma.conversation.update({
      where: { userId: user.id },
      data: { messages: [] },
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
