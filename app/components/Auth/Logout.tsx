"use client";
import { signOut } from "next-auth/react";
import "./Auth.css";

type Props = {
  onClose: () => void;
};

export default function Logout({ onClose }: Props) {
  return (
    <div className="logout-modal">
      <h2>로그아웃하시겠습니까?</h2>
      <div className="logout-modal-buttons">
        <button onClick={() => signOut()}>예</button>
        <button onClick={onClose}>아니오</button>
      </div>
    </div>
  );
}
