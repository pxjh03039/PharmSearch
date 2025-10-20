import "./SideNav.css";
import SideBar from "../SideBar";
import useSidebar from "@/app/common/hooks/useSidebar";
import { useState } from "react";
import { CONTENTS } from "@/app/common/constant";

export default function SideNav() {
  const { open, openSidebar, toggleSidebar } = useSidebar();
  const [selected, setSelected] = useState<string>("검색");

  const handleClick = (label: string) => {
    setSelected(label);
    openSidebar();
  };

  const SelectedComponent = CONTENTS.find(
    (item) => item.label === selected
  )?.Component;

  return (
    <>
      <div className="nav_container">
        <nav className="navigation">
          {CONTENTS.map(({ label }) => (
            <button
              key={label}
              className="navigation_item"
              onClick={() => handleClick(label)}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>
      <SideBar open={open} toggleSidebar={toggleSidebar}>
        {SelectedComponent && <SelectedComponent />}
      </SideBar>
    </>
  );
}
