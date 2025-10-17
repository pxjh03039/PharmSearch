import useSidebar from "@/app/common/hooks/useSidebar";
import Sidebar from "../SideBar";
import "./SideNav.css";

export default function SideNav() {
  const { open, openSidebar, closeSidebar } = useSidebar();

  return (
    <div className="nav_container">
      <nav className="navigation">
        {["검색", "AI", "길찾", "즐찾"].map((icon, i) => (
          <button key={i} className="navigation_item">
            {icon}
          </button>
        ))}
      </nav>
      <Sidebar
        open={open}
        openSidebar={openSidebar}
        closeSidebar={closeSidebar}
      />
    </div>
  );
}
