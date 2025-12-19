"use client";

import "../styles/common.css";
import { useIsMobile } from "../hooks/useIsMobile";

type Props = {
  onClick: () => void;
};

export default function GpsButton({ onClick }: Props) {
  const isMobile = useIsMobile();

  const buttonClass = isMobile ? "gps_btn gps_btn-mobile" : "gps_btn";

  return (
    <button onClick={onClick} className={buttonClass} aria-label="내 위치 찾기">
      📍
    </button>
  );
}
