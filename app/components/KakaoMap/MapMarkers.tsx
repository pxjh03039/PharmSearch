import { MapMarker } from "react-kakao-maps-sdk";
import { usePlacesStore } from "@/stores/usePlacesStore";
import { useEffect, useState } from "react";
import GpsImg from "@/app/common/assets/images/Gps.png";
import StarImg from "@/app/common/assets/images/favorite.png";
import PharmImg from "@/app/common/assets/images/pharm_marker.png";
import { KakaoPlace } from "@/app/common/types/constants";
import SearchDetail from "../Search/SearchDetail";
import { useModalStore } from "@/stores/useModalStore";
import { useSession } from "next-auth/react";
import { useFavorites } from "../Favorite/hooks/useFavorite";

type MapMarkersProps = {
  map: kakao.maps.Map;
};

export default function MapMarkers({ map }: MapMarkersProps) {
  const { place: placeList } = usePlacesStore();
  const { openModal, closeModal } = useModalStore();
  const { data: session } = useSession();
  const { favoriteList } = useFavorites(session);
  const [selectedPlace, setSelectedPlace] = useState<KakaoPlace | null>(null);
  const bounds = new kakao.maps.LatLngBounds();

  useEffect(() => {
    if (!map || !placeList.length) return;
    placeList.forEach((place) => {
      const { lat, lng } = convertToLatLng(place);
      bounds.extend(new kakao.maps.LatLng(lat, lng));
    });
    map.setBounds(bounds);
  }, [map, placeList]);

  const convertToLatLng = (place: KakaoPlace) => ({
    lng: Number(place.x),
    lat: Number(place.y),
  });

  const isFavorite = (place: KakaoPlace): boolean => {
    return favoriteList.some((fav) => fav.placeId === place.id);
  };

  // ✅ 마커 이미지 결정 함수
  const getMarkerImage = (place: KakaoPlace) => {
    return isFavorite(place) ? StarImg.src : PharmImg.src;
  };

  const handleMarkerClick = (selected: KakaoPlace) => {
    const { lat, lng } = convertToLatLng(selected);
    map.panTo(new kakao.maps.LatLng(lat, lng));
    setSelectedPlace(selected);
    openModal(
      <SearchDetail
        key={selected.id}
        selectedPlace={selected}
        onClose={closeModal}
      />
    );
  };

  const convertFavoriteToKakaoPlace = (favorite: any): KakaoPlace => {
    return {
      id: favorite.placeId,
      place_name: favorite.title,
      address_name: favorite.address,
      road_address_name: favorite.address,
      phone: favorite.phone || "",
      place_url: favorite.place_url || "",
      distance: favorite.distance || "0",
      x: favorite.lng,
      y: favorite.lat,
    };
  };

  return (
    <>
      {placeList.map((place) => {
        const { lat, lng } = convertToLatLng(place);
        return (
          <MapMarker
            key={place.id}
            position={{ lat, lng }}
            image={{
              src: getMarkerImage(place),
              size: { width: 30, height: 30 },
            }}
            onClick={() => {
              handleMarkerClick(place);
            }}
          />
        );
      })}
      {favoriteList.map((favorite) => {
        const lat = favorite.lat;
        const lng = favorite.lng;
        const kakaoPlace = convertFavoriteToKakaoPlace(favorite);

        return (
          <MapMarker
            key={`favorite-${favorite.placeId}`}
            position={{ lat, lng }}
            image={{
              src: StarImg.src,
              size: { width: 30, height: 30 },
            }}
            onClick={() => handleMarkerClick(kakaoPlace)}
          />
        );
      })}
    </>
  );
}
