"use client";

import AppWrapper from "@/app/AppWrapper";
import { Toaster } from "@/components/ui/sonner";


export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  

  return (
    <>
      <AppWrapper>{children}</AppWrapper>
      <Toaster richColors position="top-right" />
    </>
  );
}