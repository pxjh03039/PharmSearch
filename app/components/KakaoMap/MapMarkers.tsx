import { MapMarker } from "react-kakao-maps-sdk";
import { usePlacesStore } from "@/stores/usePlacesStore";
import { useEffect, useState } from "react";
import GpsImg from "@/app/common/assets/images/Gps.png";
import { KakaoPlace } from "@/app/common/types/constants";
import useModal from "../Modal/hooks/useModal";
import { Modal } from "../Modal";
import SearchDetail from "../Search/SearchDetail";

type MapMarkersProps = {
  map: kakao.maps.Map;
};

export default function MapMarkers({ map }: MapMarkersProps) {
  const { place: placeList } = usePlacesStore();
  const { isModalOpen, openModal, closeModal } = useModal();
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

  const handleMarkerClick = (selected: KakaoPlace) => {
    const { lat, lng } = convertToLatLng(selected);
    map.panTo(new kakao.maps.LatLng(lat, lng));
    setSelectedPlace(selected);
    openModal();
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
              src: GpsImg.src,
              size: { width: 30, height: 30 },
            }}
            onClick={() => {
              handleMarkerClick(place);
            }}
          />
        );
      })}
      {isModalOpen && selectedPlace && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <SearchDetail
            key={selectedPlace.id}
            selectedPlace={selectedPlace}
            onClose={closeModal}
          />
        </Modal>
      )}
    </>
  );
}
