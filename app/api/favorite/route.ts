import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/app/lib/prisma";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // 1️⃣ 해당 유저 찾기
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2️⃣ 중복 검사 (같은 placeId가 이미 있는지)
    const existing = await prisma.favorite.findFirst({
      where: {
        userId: user.id,
        placeId: String(body.id),
      },
    });

    if (existing) {
      return NextResponse.json(
        { message: "이미 즐겨찾기에 추가된 장소입니다." },
        { status: 409 } // Conflict
      );
    }

    // 3️⃣ 중복이 없으면 새로 생성
    const favorite = await prisma.favorite.create({
      data: {
        user: { connect: { id: user.id } },
        placeId: String(body.id),
        title: body.place_name,
        address: body.road_address_name || body.address_name,
        lat: new Prisma.Decimal(body.y),
        lng: new Prisma.Decimal(body.x),
        phone: body.phone || null,
        placeUrl: body.place_url,
      },
    });

    return NextResponse.json(favorite);
  } catch (error) {
    console.error("Error saving favorite:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
