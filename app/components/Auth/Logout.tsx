"use client";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import "./Auth.css";

type Props = {
  onClose: () => void;
};

export default function Logout({ onClose }: Props) {
  return (
    <div className="logout-modal">
      <h2 className="logout-title">로그아웃</h2>
      <p className="logout-message">정말 로그아웃 하시겠습니까?</p>
      <div className="logout-modal-buttons">
        <button onClick={onClose} className="logout-btn-cancel">
          취소
        </button>
        <button onClick={() => signOut()} className="logout-btn-confirm">
          로그아웃
        </button>
      </div>
    </div>
  );
}
