"use client";

import KakaoMap from "./components/KakaoMap/index";
import SideNav from "./components/SideNav";

export default function Home() {
  return (
    <div style={{ display: "flex" }}>
      <SideNav />
      <KakaoMap />
    </div>
  );
}
