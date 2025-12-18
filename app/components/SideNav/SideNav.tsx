"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebarStore } from "@/stores/useSidebarStore";
import "./SideNav.css";
import { useSession, signIn } from "next-auth/react";
import Logout from "../Auth/Logout";
import { useModalStore } from "@/stores/useModalStore";
import { LogIn, LogOut } from "lucide-react";
import { useIsMobile } from "@/app/common/hooks/useIsMobile";

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
  const isMobile = useIsMobile();

  const handleLogoutClick = () => {
    openModal(<Logout onClose={closeModal} />);
  };

  const handleLoginClick = () => {
    signIn("kakao");
  };

  return (
    <div className={`nav_container ${isMobile ? "nav_container-mobile" : ""}`}>
      <div className={`navigation ${isMobile ? "navigation-mobile" : ""}`}>
        {TABS.map((t) => {
          const active = pathname.startsWith(t.href);

          return (
            <Link
              key={t.href}
              href={t.href}
              className={`navigation_item ${active ? "active" : ""} ${
                isMobile ? "navigation_item-mobile" : ""
              }`}
              onClick={openSidebar}
            >
              {t.label}
            </Link>
          );
        })}
        {session ? (
          <button
            className={`navigation-logout ${
              isMobile ? "navigation-auth-mobile" : ""
            }`}
            onClick={handleLogoutClick}
          >
            <LogOut className="logout-icon" color="white" />
          </button>
        ) : (
          <button
            className={`navigation-login ${
              isMobile ? "navigation-auth-mobile" : ""
            }`}
            onClick={handleLoginClick}
          >
            <LogIn className="login-icon" color="white" />
          </button>
        )}
      </div>
    </div>
  );
}
