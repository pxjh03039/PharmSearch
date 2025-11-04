import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Pharm Search App",
  description: "side project for searching pharmaceutical products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head></head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
