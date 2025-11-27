"use client";

import { useLoadingStore } from "@/stores/useLoadingStore";
import "../styles/common.css";

export default function GlobalLoading() {
  const { isLoading } = useLoadingStore();

  if (!isLoading) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    </div>
  );
}
