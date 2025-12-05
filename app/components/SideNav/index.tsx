"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebarStore } from "@/stores/useSidebarStore";
import "./SideNav.css";
import { useSession, signIn } from "next-auth/react";
import Logout from "../Auth/Logout";
import { useModalStore } from "@/stores/useModalStore";
import { LogIn, LogOut } from "lucide-react";

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

  const handleLogoutClick = () => {
    openModal(<Logout onClose={closeModal} />);
  };

  const handleLoginClick = () => {
    signIn("kakao");
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
        {session ? (
          <button className="navigation-logout" onClick={handleLogoutClick}>
            <LogOut className="logout-icon" />
          </button>
        ) : (
          <button className="navigation-login" onClick={handleLoginClick}>
            <LogIn className="login-icon" />
          </button>
        )}
      </div>
    </div>
  );
}
