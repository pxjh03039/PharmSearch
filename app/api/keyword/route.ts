import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query"); // 검색어
  const x = searchParams.get("x");
  const y = searchParams.get("y");
  const radius = searchParams.get("radius") ?? "2000";
  const page = searchParams.get("page") ?? "1";
  const size = searchParams.get("size") ?? "15";

  if (!query) {
    return NextResponse.json(
      { error: "query 파라미터(검색어)가 필요합니다." },
      { status: 400 }
    );
  }

  const url = new URL("https://dapi.kakao.com/v2/local/search/keyword.json");
  url.searchParams.set("query", query);
  url.searchParams.set("category_group_code", "PM9"); // 약국
  if (x && y) {
    url.searchParams.set("x", x);
    url.searchParams.set("y", y);
  }
  url.searchParams.set("radius", radius);
  url.searchParams.set("page", page);
  url.searchParams.set("size", size);
  url.searchParams.set("sort", "distance");

  const upstream = await fetch(url.toString(), {
    headers: { Authorization: `KakaoAK ${process.env.REST_API_KEY!}` },
    cache: "no-store",
  });

  if (!upstream.ok) {
    return NextResponse.json(
      { error: "Kakao API 요청 실패 (keyword)" },
      { status: upstream.status }
    );
  }

  const data = await upstream.json();
  return NextResponse.json(data);
}
