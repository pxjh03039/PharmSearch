"use client";

import "./Favorite.css";

type Props = {
  signIn: (provider: string) => void;
};

export default function FavoriteLogin({ signIn }: Props) {
  return (
    <div className="favorite-no-login">
      로그인 후 이용하실 수 있습니다.
      <button className="favorite-no-login-btn" onClick={() => signIn("kakao")}>
        로그인
      </button>
    </div>
  );
}
