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

// 대화 조회 (없으면 자동 생성)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "인증되지 않은 사용자입니다." },
        { status: HTTP_STATUS_CODE.UNAUTHORIZED }
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

    return NextResponse.json(conversation);
  } catch (error) {
    console.error("대화 조회 실패:", error);
    return NextResponse.json(
      { error: "대화 조회에 실패했습니다." },
      { status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR }
    );
  }
}

// 대화 삭제 (초기화)
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
