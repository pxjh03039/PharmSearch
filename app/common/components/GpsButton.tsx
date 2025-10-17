"use client";
import React from "react";
import "../styles/common.css";

type Props = {
  onClick: () => void;
};

export default function GpsButton({ onClick }: Props) {
  return (
    <button onClick={onClick} className="gps_btn" aria-label="내 위치 찾기">
      📍
    </button>
  );
}
