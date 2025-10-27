import type { ReactNode } from "react";
import SideNav from "../components/SideNav";
import SideBar from "../components/SideBar";
import KakaoMap from "../components/KakaoMap";
import "../common/styles/common.css";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container">
      <SideNav />
      <SideBar>{children}</SideBar>
      <KakaoMap />
    </div>
  );
}
