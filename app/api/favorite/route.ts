import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { Prisma, type Favorite } from "@prisma/client";
import { HTTP_STATUS_CODE } from "@/app/common/apis/constants/http";
import type { FavoritePlace } from "@/app/common/types/constants";

export const runtime = "nodejs";

function toFavoritePlace(favorite: Favorite): FavoritePlace {
  return {
    placeId: favorite.placeId,
    title: favorite.title,
    address: favorite.address ?? "",
    lat: Number(favorite.lat),
    lng: Number(favorite.lng),
    placeUrl: favorite.placeUrl ?? null,
    phone: favorite.phone ?? null,
  };
}

export async function GET() {
  const SESSION = await getServerSession(authOptions);
  const EMAIL = SESSION?.user?.email;
  try {
    if (!EMAIL) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: HTTP_STATUS_CODE.UNAUTHORIZED }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: EMAIL },
      include: { favorites: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "찾을 수 없는 유저입니다." },
        { status: HTTP_STATUS_CODE.UNAUTHORIZED }
      );
    }

    return NextResponse.json(user.favorites.map(toFavoritePlace));
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function POST(req: Request) {
  const SESSION = await getServerSession(authOptions);
  const EMAIL = SESSION?.user?.email;
  try {
    if (!EMAIL) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: HTTP_STATUS_CODE.UNAUTHORIZED }
      );
    }

    const body = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: EMAIL },
    });

    if (!user) {
      return NextResponse.json(
        { error: "찾을 수 없는 유저입니다." },
        { status: HTTP_STATUS_CODE.UNAUTHORIZED }
      );
    }

    const existing = await prisma.favorite.findFirst({
      where: {
        userId: user.id,
        placeId: String(body.id),
      },
    });

    if (existing) {
      return NextResponse.json(
        { message: "이미 즐겨찾기에 추가된 장소입니다." },
        { status: HTTP_STATUS_CODE.CONFLICT }
      );
    }

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

    return NextResponse.json(toFavoritePlace(favorite));
  } catch (error) {
    console.error("Error saving favorite:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function DELETE(req: Request) {
  const SESSION = await getServerSession(authOptions);
  const EMAIL = SESSION?.user?.email;
  try {
    if (!EMAIL) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: HTTP_STATUS_CODE.UNAUTHORIZED }
      );
    }

    const { placeId } = await req.json();

    if (!placeId) {
      return NextResponse.json(
        { error: "즐겨찾기에 존재하지 않는 장소입니다." },
        { status: HTTP_STATUS_CODE.BAD_REQUEST }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: EMAIL },
    });

    if (!user) {
      return NextResponse.json(
        { error: "찾을 수 없는 유저입니다." },
        { status: HTTP_STATUS_CODE.UNAUTHORIZED }
      );
    }

    const deleted = await prisma.favorite.deleteMany({
      where: { userId: user.id, placeId: String(placeId) },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { message: "삭제할 즐겨찾기를 찾을 수 없습니다." },
        { status: HTTP_STATUS_CODE.CONFLICT }
      );
    }

    return NextResponse.json({ message: "즐겨찾기에서 삭제되었습니다." });
  } catch (error) {
    console.error("Error deleting favorite:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
