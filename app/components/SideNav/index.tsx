import "./SideNav.css";

type Props = {
  openSidebar: () => void;
};

export default function SideNav({ openSidebar }: Props) {
  return (
    <div className="nav_container">
      <nav className="navigation">
        {["검색", "AI", "길찾", "즐찾"].map((icon, i) => (
          <button key={i} className="navigation_item" onClick={openSidebar}>
            {icon}
          </button>
        ))}
      </nav>
    </div>
  );
}
