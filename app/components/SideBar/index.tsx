"use client";

import "./SideBar.css";

type Props = {
  open: boolean;
  toggleSidebar: () => void;
};

export default function Sidebar({ open, toggleSidebar }: Props) {
  return (
    <div className={`sidebar_container ${open ? "open" : "closed"}`}>
      <button onClick={toggleSidebar} className="sidebar_toggle_btn">
        {open ? "<" : ">"}
      </button>
    </div>
  );
}
