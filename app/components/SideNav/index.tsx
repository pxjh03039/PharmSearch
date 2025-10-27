"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebarStore } from "@/stores/useSidebarStore";
import "./SideNav.css";
import { TABS } from "@/app/common/constant";

export default function SideNav() {
  const pathname = usePathname();
  const { openSidebar } = useSidebarStore();

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
      </div>
    </div>
  );
}
