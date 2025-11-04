"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useUserStore } from "../../stores/useUserStore";

const UserSyncStore = () => {
  const { data, status } = useSession();
  const { setUser, clearUser } = useUserStore();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "authenticated" && data?.user) {
      const { name, email } = data.user;
      setUser({
        name: name ?? "",
        email: email ?? "",
      });
    } else {
      clearUser();
    }
  }, [status, data, setUser, clearUser]);

  return null;
};

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <UserSyncStore />
      {children}
    </SessionProvider>
  );
}
