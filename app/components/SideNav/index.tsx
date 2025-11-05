"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebarStore } from "@/stores/useSidebarStore";
import "./SideNav.css";
import { signOut, useSession } from "next-auth/react";
import useModal from "../Modal/hooks/useModal";
import { Modal } from "../Modal";
import Logout from "../Logout";

const TABS = [
  { href: "/search", label: "검색" },
  { href: "/chat", label: "챗봇" },
  { href: "/favorite", label: "즐찾" },
  { href: "/direction", label: "길찾" },
];

export default function SideNav() {
  const pathname = usePathname();
  const { openSidebar } = useSidebarStore();
  const { isModalOpen, openModal, closeModal } = useModal();
  const { data: session } = useSession();

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
            <button className="navigation-logout" onClick={openModal}>
              <img
                src="/Logout.png"
                alt="logout icon"
                className="logout-icon"
              />
            </button>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
              <Logout onClose={closeModal} />
            </Modal>
          </>
        )}
      </div>
    </div>
  );
}
