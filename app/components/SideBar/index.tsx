"use client";

import "./SideBar.css";

type Props = {
  open: boolean;
  toggleSidebar: () => void;
  children?: React.ReactNode;
};

export default function SideBar({ open, toggleSidebar, children }: Props) {
  return (
    <div className={`sidebar_container ${open ? "open" : "close"}`}>
      <div className="sidebar_content">{children}</div>
      <button onClick={toggleSidebar} className="sidebar_toggle_btn">
        {open ? "<" : ">"}
      </button>
    </div>
  );
}
