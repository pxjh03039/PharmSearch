import { NextRequest, NextResponse } from "next/server";
import { HTTP_STATUS_CODE } from "../../common/apis/constants/http";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  const x = searchParams.get("x");
  const y = searchParams.get("y");

  if (!query) {
    return NextResponse.json(
      { error: "query 파라미터(검색어)가 필요합니다." },
      { status: HTTP_STATUS_CODE.BAD_REQUEST }
    );
  }

  if (!x || !y) {
    return NextResponse.json(
      { error: "x(lng), y(lat) 파라미터가 필요합니다." },
      { status: HTTP_STATUS_CODE.BAD_REQUEST }
    );
  }

  const url = new URL("https://dapi.kakao.com/v2/local/search/keyword.json");

  url.searchParams.set("query", query);
  url.searchParams.set("category_group_code", "PM9");
  url.searchParams.set("x", x);
  url.searchParams.set("y", y);
  url.searchParams.set("radius", "2000");
  url.searchParams.set("page", "1");
  url.searchParams.set("size", "15");
  url.searchParams.set("sort", "distance");

  const response = await fetch(url.toString(), {
    headers: { Authorization: `KakaoAK ${process.env.REST_API_KEY}` },
    cache: "no-store",
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Kakao API 요청 실패 (keyword)" },
      { status: response.status }
    );
  }

  const data = await response.json();
  return NextResponse.json(data);
}
