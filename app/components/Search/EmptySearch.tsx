"use client";

import "./Search.css";

type EmptySearchState = "initial" | "noPlace" | "noPharmacy";

type Props = {
  state: EmptySearchState;
};

export default function EmptySearch({ state }: Props) {
  if (state === "initial") {
    return (
      <div className="empty-state">
        <div className="empty-icon empty-icon--bounce">🔍</div>
        <h3 className="empty-title">어디 약국으로 안내해 드릴까요?</h3>
        <p className="empty-description">약국명이나 주소를 검색해보세요!</p>
      </div>
    );
  }

  if (state === "noPlace") {
    return (
      <div className="empty-state">
        <div className="empty-icon empty-icon--wiggle">🤔</div>
        <h3 className="empty-title">검색 결과가 없어요</h3>
        <p className="empty-description">장소를 찾을 수 없습니다</p>
        <div className="empty-tips">
          <p className="tip-item">💡 띄어쓰기를 확인해보세요</p>
          <p className="tip-item">💡 다른 표현으로 검색해보세요</p>
        </div>
      </div>
    );
  }

  return (
    <div className="empty-state">
      <div className="empty-icon empty-icon--wiggle">💊</div>
      <h3 className="empty-title">주변에 약국이 없어요</h3>
      <p className="empty-description">
        검색하신 위치 반경 2km 내에 약국이 없습니다
      </p>
      <div className="empty-tips empty-tips--info">
        <p className="tip-item">💡 다른 지역을 검색해보세요</p>
        <p className="tip-item">💡 더 넓은 지역으로 검색해보세요</p>
      </div>
    </div>
  );
}
