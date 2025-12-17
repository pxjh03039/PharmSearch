import type { NextAuthOptions } from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
      profile(profile) {
        return {
          id: String(profile.id),
          name:
            profile.kakao_account?.profile?.nickname ??
            profile.properties?.nickname ??
            "카카오 사용자",
          email: profile.kakao_account?.email ?? null,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) {
        console.error("Kakao login failed: email is missing");
        return false;
      }
      return true;
    },
  },
};

