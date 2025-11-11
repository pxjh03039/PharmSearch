"use client";

import "../styles/common.css";

type Props = {
  length?: number;
};

export default function GlobalSkeleton({ length = 10 }: Props) {
  return (
    <ul className="favorite-list" aria-busy="true" aria-live="polite">
      {Array.from({ length: length }).map((_, i) => (
        <li key={`sk-${i}`} className="is-skeleton">
          <div className="item-header">
            <div className="sk sk-title" />
          </div>
          <div className="sk sk-line" />
          <div className="sk sk-line short" />
          <div className="sk sk-line xshort" />
        </li>
      ))}
    </ul>
  );
}
