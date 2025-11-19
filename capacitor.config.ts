import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.pharmsearch",
  appName: "팜서치",
  webDir: "public",
  server: {
    url: "https://pharm-search.vercel.app/", // ✅ 배포된 Next 서버 주소
    cleartext: false, // https면 false
  },
};

export default config;
