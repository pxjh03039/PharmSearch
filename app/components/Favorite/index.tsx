"use client";

import "./Favorite.css";
import { signIn, useSession } from "next-auth/react";

export default function Favorite() {
  const { data: session } = useSession();
  const favoriteList: any = [];

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
      ) : (
        <ul className="favorite-list">
          {favoriteList.length === 0 ? (
            <div className="favorite-no-data">
              {session.user?.name}님 저장된 관심 장소가 없습니다.
            </div>
          ) : (
            favoriteList.map((data: any) => (
              <li key={data.id} className="favorite-item">
                <div className="title">{data.place_name}</div>
                <div className="address">
                  {data.road_address_name || data.address_name}
                </div>
                <div className="address">
                  {data.phone ? ` ${data.phone}` : "-"}
                </div>
                <div className="address">
                  {data.distance ? ` ${data.distance}m` : ""}
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
