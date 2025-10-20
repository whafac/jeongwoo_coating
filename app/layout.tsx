import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import "./globals.css";

export const metadata: Metadata = {
  title: "정우특수코팅 - 인쇄코팅 후가공 전문",
  description: "정우특수코팅은 인쇄코팅 후가공 전문 업체입니다. UV코팅, 라미네이팅, 박 등 다양한 코팅 서비스를 제공합니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <Chatbot />
      </body>
    </html>
  );
}
