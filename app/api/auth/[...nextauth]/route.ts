import NextAuth from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";

const handler = NextAuth({
  providers: [
    KakaoProvider({
      clientId: process.env.REST_API_KEY!,
      clientSecret: process.env.CLIENT_SECRET!,
    }),
  ],
});

export { handler as GET, handler as POST };
