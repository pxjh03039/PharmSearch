"use client";

interface SearchEmptyStateProps {
  hasSearched: boolean;
}

export default function EmptySearch({ hasSearched }: SearchEmptyStateProps) {
  if (!hasSearched) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🔍</div>
        <h3 className="empty-title">어디 약국으로 안내해 드릴까요?</h3>
        <p className="empty-description">약국명이나 주소를 검색해보세요!</p>
        {/* <div className="empty-suggestions">
          <span className="suggestion-chip">카페</span>
          <span className="suggestion-chip">맛집</span>
          <span className="suggestion-chip">공원</span>
        </div> */}

        <style jsx>{`
          .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 4rem 2rem;
            text-align: center;
            animation: fadeIn 0.5s ease-in;
          }

          .empty-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
            animation: bounce 2s infinite;
          }

          .empty-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: #111827;
            margin: 0 0 0.5rem 0;
          }

          .empty-description {
            font-size: 0.95rem;
            color: #6b7280;
            margin: 0 0 1.5rem 0;
          }

          .empty-suggestions {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
            justify-content: center;
          }

          .suggestion-chip {
            padding: 0.5rem 1rem;
            background: #f3f4f6;
            border-radius: 20px;
            font-size: 0.875rem;
            color: #374151;
            cursor: pointer;
            transition: all 0.2s;
          }

          .suggestion-chip:hover {
            background: #e5e7eb;
            transform: translateY(-2px);
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes bounce {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="empty-state">
      <div className="empty-icon">🤔</div>
      <h3 className="empty-title">검색 결과가 없어요</h3>
      <p className="empty-description">다른 키워드로 다시 검색해보세요</p>
      <div className="empty-tips">
        <p className="tip-item">💡 띄어쓰기를 확인해보세요</p>
        <p className="tip-item">💡 다른 표현으로 검색해보세요</p>
      </div>

      <style jsx>{`
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          text-align: center;
          animation: fadeIn 0.5s ease-in;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          animation: wiggle 1s ease-in-out infinite;
        }

        .empty-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
          margin: 0 0 0.5rem 0;
        }

        .empty-description {
          font-size: 0.95rem;
          color: #6b7280;
          margin: 0 0 1.5rem 0;
        }

        .empty-tips {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          align-items: flex-start;
          background: #fef3c7;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          border: 2px dashed #fbbf24;
        }

        .tip-item {
          font-size: 0.875rem;
          color: #92400e;
          margin: 0;
          text-align: left;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes wiggle {
          0%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-10deg);
          }
          75% {
            transform: rotate(10deg);
          }
        }
      `}</style>
    </div>
  );
}
