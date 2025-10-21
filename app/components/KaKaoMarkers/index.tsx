import { MapMarker } from "react-kakao-maps-sdk";
import { usePlacesStore } from "@/stores/usePlacesStore";
import { useEffect } from "react";
import GpsImg from "@/app/common/assets/images/Gps.png";

const toLatLng = (p: any) => ({
  lat: Number(p.y ?? p.lat),
  lng: Number(p.x ?? p.lng),
});

export default function KakaoMarkers({ map }: { map: kakao.maps.Map | null }) {
  const list = usePlacesStore((s) => s.place);

  useEffect(() => {
    if (!map || list.length === 0) return;
    const bounds = new kakao.maps.LatLngBounds();
    list.forEach((p) => {
      const { lat, lng } = toLatLng(p);
      bounds.extend(new kakao.maps.LatLng(lat, lng));
    });
    map.setBounds(bounds);
  }, [map, list]);

  return (
    <>
      {list.map((p) => {
        const { lat, lng } = toLatLng(p);
        return (
          <MapMarker
            key={p.id}
            position={{ lat, lng }}
            image={{
              src: GpsImg.src,
              size: { width: 30, height: 30 },
            }}
            onClick={() => {
              map?.panTo(new kakao.maps.LatLng(lat, lng));
            }}
          />
        );
      })}
    </>
  );
}
