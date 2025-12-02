"use client";

import "./Auth.css";

type Props = {
  signIn: (provider: string) => void;
};

export default function Login({ signIn }: Props) {
  return (
    <div className="no-login">
      로그인 후 이용하실 수 있습니다.
      <button className="no-login-btn" onClick={() => signIn("kakao")}>
        로그인
      </button>
    </div>
  );
}
