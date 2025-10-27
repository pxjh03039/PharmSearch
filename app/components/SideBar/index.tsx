"use client";

import { useSidebarStore } from "@/stores/useSidebarStore";
import "./SideBar.css";

export default function SideBar({ children }: { children: React.ReactNode }) {
  const { open, toggleSidebar } = useSidebarStore();
  return (
    <div className={`sidebar_container ${open ? "open" : "close"}`}>
      <div className="sidebar_content">{children}</div>
      <button onClick={toggleSidebar} className="sidebar_toggle_btn">
        {open ? "<" : ">"}
      </button>
    </div>
  );
}
