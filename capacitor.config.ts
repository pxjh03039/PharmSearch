import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.pharmsearch",
  appName: "팜서치",
  webDir: "public",
  server: {
    // Hosted Next.js URL (only needed for live reload with a remote server)
    url: "https://pharm-search.vercel.app/",
    cleartext: false,
  },
};

export default config;
