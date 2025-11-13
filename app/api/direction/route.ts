import { HTTP_STATUS_CODE } from "@/app/common/apis/constants/http";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const origin = searchParams.get("origin");
  const destination = searchParams.get("destination");

  if (!origin) {
    return NextResponse.json(
      { error: "origin 출발지가 필요합니다." },
      { status: HTTP_STATUS_CODE.BAD_REQUEST }
    );
  }

  if (!destination) {
    return NextResponse.json(
      { error: "destination 목적지가 필요합니다." },
      { status: HTTP_STATUS_CODE.BAD_REQUEST }
    );
  }

  const params = new URLSearchParams({
    origin: origin,
    destination: destination,
    priority: "RECOMMEND",
  });

  const response = await fetch(
    `https://apis-navi.kakaomobility.com/v1/directions?${params.toString()}`,
    {
      headers: {
        Authorization: `KakaoAK ${process.env.KAKAO_CLIENT_ID!}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );
  if (!response.ok) {
    return NextResponse.json(
      { error: "Kakao Navi API 요청 실패 (direction)" },
      { status: response.status }
    );
  }

  const data = await response.json();
  return NextResponse.json(data);
}
