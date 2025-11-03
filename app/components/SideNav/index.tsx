"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebarStore } from "@/stores/useSidebarStore";
import "./SideNav.css";
import { TABS } from "@/app/common/constant";
import { signOut, useSession } from "next-auth/react";

export default function SideNav() {
  const pathname = usePathname();
  const { openSidebar } = useSidebarStore();
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
          <button className="navigation-logout" onClick={() => signOut()}>
            <img src="/Logout.png" alt="logout icon" className="logout-icon" />
          </button>
        )}
      </div>
    </div>
  );
}
