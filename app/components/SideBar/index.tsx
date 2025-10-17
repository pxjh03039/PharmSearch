"use client";

import { useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import "./SideBar.css";

const RAIL_W = 64; // 항상 보이는 아이콘 바 너비
const PANEL_W = 320; // 열고/닫는 사이드바 너비

type Props = {
  open: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
};

export default function Sidebar({ open, openSidebar, closeSidebar }: Props) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const doSearch = (keyword: string) => {
    if (!keyword || !window.kakao?.maps?.services) {
      setResults([]);
      return;
    }
    window.kakao.maps.load(() => {
      const geocoder = new kakao.maps.services.Geocoder();
      geocoder.addressSearch(keyword, (data, status) => {
        if (status === kakao.maps.services.Status.OK) setResults(data);
        else setResults([]);
      });
    });
  };

  const debouncedSearch = useMemo(() => debounce(doSearch, 400), []);
  useEffect(() => {
    debouncedSearch(q);
    return () => debouncedSearch.cancel();
  }, [q, debouncedSearch]);

  const handlePick = (item: any) => {
    const lat = parseFloat(item.y);
    const lng = parseFloat(item.x);
  };
  const sidebarLeft = open ? RAIL_W : RAIL_W - PANEL_W;
  const toggleLeft = sidebarLeft + PANEL_W;

  return (
    <>
      <div
        className={`sidebar_container ${open ? "open" : "closed"}`}
        style={{
          // left: sidebarLeft, // ✅ 이 부분만 동적으로 주입
          boxShadow: open ? "2px 0 10px rgba(0,0,0,0.08)" : "none", // 필요 시 이것도
        }}
      >
        {/* <aside
          style={{
            width: "100%",
            height: "100%",
            padding: 16,
            boxSizing: "border-box",
            overflow: "auto",
            background: "#fff",
          }}
        >
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
            주소 검색
          </h2>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="예) 부산광역시 부산진구 중앙대로"
            style={{
              width: "100%",
              marginTop: 12,
              padding: "10px 12px",
              border: "1px solid #d1d5db",
              borderRadius: 8,
              outline: "none",
            }}
          />
          <div style={{ marginTop: 12, fontSize: 12, color: "#6b7280" }}>
            입력을 멈추면 0.4초 후 자동 검색돼요.
          </div>

          <ul style={{ listStyle: "none", padding: 0, marginTop: 16 }}>
            {results.map((r, idx) => (
              <li
                key={`${r.road_address?.address_name ?? r.address_name}-${idx}`}
                onClick={() => handlePick(r)}
                style={{
                  padding: "10px 8px",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  marginBottom: 8,
                  cursor: "pointer",
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 14 }}>
                  {r.road_address?.address_name || r.address_name}
                </div>
                {r.address_name && r.road_address?.address_name && (
                  <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                    지번: {r.address_name}
                  </div>
                )}
              </li>
            ))}
            {q && results.length === 0 && (
              <li style={{ color: "#9ca3af", fontSize: 14 }}>
                검색 결과가 없습니다.
              </li>
            )}
          </ul>
        </aside> */}
      </div>

      {/* ↔️ 토글 버튼 (사이드바 오른쪽 엣지에 붙임) */}
      <button
        onClick={open ? closeSidebar : openSidebar}
        aria-label="사이드바 열기/닫기"
        style={{
          position: "absolute",
          top: 16,
          left: toggleLeft,
          transform: "translateX(-50%)",
          zIndex: 30,
          width: 36,
          height: 36,
          // borderRadius: "5000px",
          border: "1px solid #d1d5db",
          background: "#fff",
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          cursor: "pointer",
          transition: "left 0.3s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {open ? "←" : "→"}
      </button>
    </>
  );
}
