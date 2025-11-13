import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const x = searchParams.get("x"); // lng
  const y = searchParams.get("y"); // lat

  if (!x || !y) {
    return NextResponse.json(
      { error: "x, y 좌표가 필요합니다." },
      { status: 400 }
    );
  }

  const response = await fetch(
    `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${x}&y=${y}`,
    {
      headers: {
        Authorization: `KakaoAK ${process.env.KAKAO_CLIENT_ID!}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const text = await response.text();
    return NextResponse.json(
      { error: "카카오 역지오코드 실패", detail: text },
      { status: response.status }
    );
  }

  const data = await response.json();
  return NextResponse.json(data);
}
