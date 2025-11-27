import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import GlobalLoading from "./common/components/GlobalLoading";
import GlobalModal from "./common/components/GlobalModal";

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
        <Providers>
          {children}
          <GlobalModal />
          <GlobalLoading />
        </Providers>
      </body>
    </html>
  );
}
