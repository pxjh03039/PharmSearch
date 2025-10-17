"use client";

import Ai from "../Ai";
import Direction from "../Direction";
import Favorites from "../Favorites";
import Search from "../Search";
import "./SideBar.css";

type Props = {
  open: boolean;
  toggleSidebar: () => void;
};

export default function SideBar({ open, toggleSidebar }: Props) {
  return (
    <div className={`sidebar_container ${open ? "open" : "close"}`}>
      <Search />
      <Ai />
      <Direction />
      <Favorites />
      <button onClick={toggleSidebar} className="sidebar_toggle_btn">
        {open ? "<" : ">"}
      </button>
    </div>
  );
}
