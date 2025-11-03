"use client";

import "./Favorite.css";
import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Favorite() {
  const { data: session } = useSession();
  console.log("session in Favorite:", session);
  const testDataEmpty: any = [];
  const testData: any = [
    {
      address_name: "서울 구로구 구로동 191-7",
      category_group_code: "PM9",
      category_group_name: "약국",
      category_name: "의료,건강 > 약국",
      distance: "190",
      id: "1692824030",
      phone: "02-2025-7111",
      place_name: "그린약국",
      place_url: "http://place.map.kakao.com/1692824030",
      road_address_name: "서울 구로구 디지털로33길 11",
      x: "126.895511548858",
      y: "37.4857059573699",
    },
    {
      address_name: "서울 구로구 구로동 188-25",
      category_group_code: "PM9",
      category_group_name: "약국",
      category_name: "의료,건강 > 약국",
      distance: "198",
      id: "25807037",
      phone: "02-6344-3990",
      place_name: "팜프라자약국",
      place_url: "http://place.map.kakao.com/25807037",
      road_address_name: "서울 구로구 디지털로 300",
      x: "126.896539278775",
      y: "37.484928390908",
    },
    {
      address_name: "서울 영등포구 대림동 1082-13",
      category_group_code: "PM9",
      category_group_name: "약국",
      category_name: "의료,건강 > 약국",
      distance: "277",
      id: "1753640267",
      phone: "02-832-5525",
      place_name: "휴베이스수강약국",
      place_url: "http://place.map.kakao.com/1753640267",
      road_address_name: "서울 영등포구 디지털로 343",
      x: "126.898913045432",
      y: "37.4887579267266",
    },
  ];

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
          {testDataEmpty.length === 0 ? (
            <div className="favorite-no-data">저장된 관심 장소가 없습니다.</div>
          ) : (
            testDataEmpty.map((data: any) => (
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
          <button className="favorite-no-login-btn" onClick={() => signOut()}>
            로그아웃
          </button>
        </ul>
      )}
    </div>
  );
}
