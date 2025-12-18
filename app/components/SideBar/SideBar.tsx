"use client";

import { useSidebarStore } from "@/stores/useSidebarStore";
import { useIsMobile } from "@/app/common/hooks/useIsMobile";
import "./SideBar.css";

export default function SideBar({ children }: { children: React.ReactNode }) {
  const { open, toggleSidebar } = useSidebarStore();
  const isMobile = useIsMobile();
  const containerClass = isMobile
    ? `sidebar_container-mobile ${open ? "open" : "close"}`
    : `sidebar_container ${open ? "open" : "close"}`;

  return (
    <div className={containerClass}>
      <button
        onClick={toggleSidebar}
        className={`sidebar_toggle_btn ${
          isMobile ? "sidebar_toggle_mobile" : ""
        }`}
      >
        {open ? (isMobile ? "∨" : "<") : isMobile ? "∧" : ">"}
      </button>
      <div className="sidebar_content">{children}</div>
    </div>
  );
}
