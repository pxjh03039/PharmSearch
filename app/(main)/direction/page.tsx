"use client";

import { useEffect, useState } from "react";
import DirectionGuide from "@/app/components/Direction/DirectionGuide";
import DirectionHeader from "@/app/components/Direction/DirectionHeader";
import DirectionSummary from "@/app/components/Direction/DirectionSummary";
import { KakaoPlace, LatLng } from "@/app/common/types/constants";
import { useDirection } from "@/app/components/Direction/hooks/useDirection";
import { useSearchParams } from "next/navigation";
import { useLocationStore } from "@/stores/useLocationStore";
import { signIn, useSession } from "next-auth/react";
import Login from "@/app/components/Auth/Login";

export default function DirectionPage() {
  const { data: session } = useSession();

  const searchParams = useSearchParams();
  const { myGps } = useLocationStore();

  const [origin, setOrigin] = useState<LatLng | null>(null);
  const [destination, setDestination] = useState<LatLng | null>(null);

  const [originText, setOriginText] = useState("");
  const [destinationText, setDestinationText] = useState("");

  const [searchOrigin, setSearchOrigin] = useState<LatLng | null>(null);
  const [searchDestination, setSearchDestination] = useState<LatLng | null>(
    null
  );

  useEffect(() => {
    const destLat = searchParams.get("destLat");
    const destLng = searchParams.get("destLng");
    const destName = searchParams.get("destName");
    console.log({ destLat, destLng, destName });

    if (destLat && destLng) {
      const dest = {
        lat: parseFloat(destLat),
        lng: parseFloat(destLng),
      };
      setDestination(dest);
      setDestinationText(destName || "");

      // 현재 위치를 출발지로 설정
      if (myGps) {
        setOrigin(myGps);
        setOriginText("현재 위치");

        // 자동으로 검색 실행
        setSearchOrigin(myGps);
        setSearchDestination(dest);
      }
    }
  }, [searchParams, myGps]);

  const { data: directionData, isLoading } = useDirection(
    origin!,
    destination!,
    !!searchOrigin && !!searchDestination
  );
  const summary = directionData?.summary;
  const guides = directionData?.sections?.[0]?.guides;

  const handleOriginSearch = (place: KakaoPlace | null) => {
    if (place) {
      const newOrigin = {
        lat: parseFloat(place.y),
        lng: parseFloat(place.x),
      };
      setOrigin(newOrigin);
      setOriginText(place.place_name);

      if (destination) {
        setSearchOrigin(newOrigin);
        setSearchDestination(destination);
      }
    }
  };

  const handleDestinationSearch = (place: KakaoPlace | null) => {
    if (place) {
      const newDestination = {
        lat: parseFloat(place.y),
        lng: parseFloat(place.x),
      };
      setDestination(newDestination);
      setDestinationText(place.place_name);

      if (origin) {
        setSearchOrigin(origin);
        setSearchDestination(newDestination);
      }
    }
  };

  const handleSearchClick = () => {
    if (origin && destination) {
      setSearchOrigin(origin);
      setSearchDestination(destination);
    } else {
      alert("출발지와 도착지를 모두 입력해주세요.");
    }
  };

  if (!session) {
    return (
      <div className="login-container">
        <Login signIn={signIn} />
      </div>
    );
  }

  return (
    <div className="direction-container">
      <DirectionHeader
        onOriginSearch={handleOriginSearch}
        onDestinationSearch={handleDestinationSearch}
        onSearchClick={handleSearchClick}
        origin={origin}
        canSearch={!!origin && !!destination}
        originText={originText}
        destinationText={destinationText}
      />

      {isLoading && (
        <div className="direction-loading-overlay">
          <div className="direction-loading-spinner"></div>
          <p className="direction-loading-text">경로를 검색중입니다...</p>
        </div>
      )}

      {summary && (
        <>
          <DirectionSummary
            duration={summary.duration}
            distance={summary.distance}
            fare={summary.fare?.taxi}
          />

          <DirectionGuide guides={guides} />
        </>
      )}

      {!origin && !destination && (
        <div className="direction-empty">
          <h3 className="empty-title">경로 안내</h3>
          <p className="empty-description">
            <strong>출발지:</strong> 원하는 장소를 검색하세요.
          </p>
          <p className="empty-description">
            <strong>도착지:</strong> 출발지 근처 약국이 자동으로 표시됩니다.
          </p>
          <p className="empty-hint">
            출발지와 도착지를 모두 선택하면 경로가 표시됩니다.
          </p>
        </div>
      )}
    </div>
  );
}
