"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Login() {
  const { data: session } = useSession();
  return (
    <div>
      {session ? (
        <>
          <div>안녕하세요, {session.user?.name}</div>
          <button onClick={() => signOut()}>로그아웃</button>
        </>
      ) : (
        <button onClick={() => signIn("kakao")}>카카오로 로그인</button>
      )}
    </div>
  );
}
