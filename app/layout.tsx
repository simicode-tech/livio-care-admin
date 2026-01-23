import type { Metadata } from "next";
import { sfPro } from './fonts'
import ClientLayout from "./client-layout";
import "./globals.css";

export const metadata: Metadata = {
  title: "Livio Care ",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sfPro.variable} font-sans antialiased`}
    >
      <body className="font-sans">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
