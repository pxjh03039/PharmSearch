"use client";

import { useKakaoLoader } from "react-kakao-maps-sdk";

export default function useKakaoSdkLoader() {
  const [loading, error] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAOMAP_KEY!,
    libraries: ["services"],
  });

  return {
    isMapLoading: loading,
    isMapError: error,
  };
}
