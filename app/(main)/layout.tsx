import type { ReactNode } from "react";
import "../common/styles/common.css";
import SideNav from "../components/SideNav/SideNav";
import SideBar from "../components/SideBar/SideBar";
import MapComponents from "../components/KakaoMap/MapComponents";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container">
      <SideNav />
      <SideBar>{children}</SideBar>
      <MapComponents />
    </div>
  );
}
