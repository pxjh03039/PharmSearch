"use client";

import KakaoMap from "./components/KakaoMap/index";
import SideNav from "./components/SideNav";

export default function Page() {
  return (
    <div className="container">
      <SideNav />
      <KakaoMap />
    </div>
  );
}
