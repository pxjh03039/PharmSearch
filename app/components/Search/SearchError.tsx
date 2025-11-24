"use client";

import "./Search.css";

type Props = {
  error: Error;
};

export default function SearchError({ error }: Props) {
  return <div className="status-message error">{error.message}</div>;
}
