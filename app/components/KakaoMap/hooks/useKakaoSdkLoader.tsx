"use client";

import { useKakaoLoader } from "react-kakao-maps-sdk";

export default function useKakaoSdkLoader() {
  useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAOMAP_KEY!,
    libraries: ["services"],
  });
  return null;
}
