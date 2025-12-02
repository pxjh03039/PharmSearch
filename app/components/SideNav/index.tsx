"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebarStore } from "@/stores/useSidebarStore";
import "./SideNav.css";
import { useSession } from "next-auth/react";
import Logout from "../Auth/Logout";
import { useModalStore } from "@/stores/useModalStore";

const TABS = [
  { href: "/search", label: "검색" },
  { href: "/chat", label: "챗봇" },
  { href: "/favorite", label: "즐찾" },
  { href: "/direction", label: "길찾" },
];

export default function SideNav() {
  const pathname = usePathname();
  const { openSidebar } = useSidebarStore();
  const { openModal, closeModal } = useModalStore();
  const { data: session } = useSession();

  const handleClick = () => {
    openModal(<Logout onClose={closeModal} />);
  };

  return (
    <div className="nav_container">
      <div className="navigation">
        {TABS.map((t) => {
          const active = pathname.startsWith(t.href);

          return (
            <Link
              key={t.href}
              href={t.href}
              className={`navigation_item ${active ? "active" : ""}`}
              onClick={openSidebar}
            >
              {t.label}
            </Link>
          );
        })}
        {session && (
          <>
            <button className="navigation-logout" onClick={handleClick}>
              <img
                src="/Logout.png"
                alt="logout icon"
                className="logout-icon"
              />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
