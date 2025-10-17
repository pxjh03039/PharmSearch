"use client";

import "./SideBar.css";

type Props = {
  open: boolean;
  toggleSidebar: () => void;
};

export default function Sidebar({ open, toggleSidebar }: Props) {
  return (
    <div className={`sidebar_container ${open ? "open" : "close"}`}>
      <div>검색</div>
      <div>Ai</div>
      <div>길찾</div>
      <div>검색</div>
      <button onClick={toggleSidebar} className="sidebar_toggle_btn">
        {open ? "<" : ">"}
      </button>
    </div>
  );
}
