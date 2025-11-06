import { NextRequest, NextResponse } from "next/server";
import { HTTP_STATUS_CODE } from "../../common/apis/constants/http";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const x = searchParams.get("x");
  const y = searchParams.get("y");

  if (!x || !y) {
    return NextResponse.json(
      { error: "x(lng), y(lat) 파라미터가 필요합니다." },
      { status: HTTP_STATUS_CODE.BAD_REQUEST }
    );
  }

  const url = new URL("https://dapi.kakao.com/v2/local/search/category.json");

  url.searchParams.set("category_group_code", "PM9");
  url.searchParams.set("x", x);
  url.searchParams.set("y", y);
  url.searchParams.set("radius", "2000");
  url.searchParams.set("page", "1");
  url.searchParams.set("size", "15");
  url.searchParams.set("sort", "distance");

  const response = await fetch(url.toString(), {
    headers: { Authorization: `KakaoAK ${process.env.KAKAO_CLIENT_ID}` },
    cache: "no-store",
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Kakao API 요청 실패 (pharmacies)" },
      { status: response.status }
    );
  }

  const data = await response.json();
  return NextResponse.json(data);
}
