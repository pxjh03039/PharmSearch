"use client";

import useSidebar from "./common/hooks/useSidebar";
import KakaoMap from "./components/KakaoMap/index";
import SideBar from "./components/SideBar";
import SideNav from "./components/SideNav";

export default function Home() {
  const { open, openSidebar, toggleSidebar } = useSidebar();
  return (
    <div style={{ display: "flex" }}>
      <SideNav openSidebar={openSidebar} />
      <SideBar open={open} toggleSidebar={toggleSidebar} />
      <KakaoMap />
    </div>
  );
}
