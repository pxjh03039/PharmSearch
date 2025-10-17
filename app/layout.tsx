import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
