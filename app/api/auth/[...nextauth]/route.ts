import NextAuth, { type NextAuthOptions } from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/app/lib/prisma";

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
          email: profile.kakao_account?.email ?? null, // 🔥 꼭 넘겨주기
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // 이메일 없으면 로그인 막고 에러 로그 남김
      if (!user.email) {
        console.error("Kakao login failed: email is missing");
        return false;
      }
      return true;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
