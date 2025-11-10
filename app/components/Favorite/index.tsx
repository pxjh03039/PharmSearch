"use client";

import "./Favorite.css";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Favorite() {
  const { data: session } = useSession();
  const [favoriteList, setFavoriteList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      const fetchFavorites = async () => {
        try {
          setLoading(true);
          const res = await fetch("/api/favorite");
          if (!res.ok) throw new Error("Failed to fetch favorites");

          const data = await res.json();
          setFavoriteList(data);
        } catch (error) {
          console.error("Error fetching favorites:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchFavorites();
    }
  }, [session]);

  const handleDelete = async (placeId: string) => {
    try {
      const res = await fetch("/api/favorite", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ placeId }),
      });

      const data = await res.json();
      alert(data.message || "삭제 완료");

      // 새로고침 or 상태 갱신
      setFavoriteList((prev) => prev.filter((f) => f.placeId !== placeId));
    } catch (error) {
      console.error(error);
      alert("삭제 실패");
    }
  };

  return (
    <div className="favorite-container">
      {!session ? (
        <div className="favorite-no-login">
          로그인 후 이용하실 수 있습니다.
          <button
            className="favorite-no-login-btn"
            onClick={() => signIn("kakao")}
          >
            로그인
          </button>
        </div>
      ) : loading ? (
        <div className="favorite-no-data">불러오는 중...</div>
      ) : (
        <ul className="favorite-list">
          {favoriteList.length === 0 ? (
            <div className="favorite-no-data">
              {session.user?.name}님 저장된 관심 장소가 없습니다.
            </div>
          ) : (
            favoriteList.map((data: any) => (
              <li key={data.id} className="favorite-item">
                <div className="title">{data.title}</div>
                <button
                  className="favorite-delete-btn"
                  onClick={() => handleDelete(data.placeId)}
                >
                  X
                </button>
                <div className="address">{data.address}</div>
                <div className="address">
                  {data.phone ? ` ${data.phone}` : "-"}
                </div>
                <div className="address">
                  {data.placeUrl && (
                    <a
                      href={data.placeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      장소보기
                    </a>
                  )}
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
