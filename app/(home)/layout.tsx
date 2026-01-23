"use client";


import  Sidebar  from "@/components/sidebar";
import Navbar from "@/components/navbar";
import { useRouter} from "next/navigation";
import { useAuthenticated } from "@/hooks/useAuthentication";
import { useEffect, useState } from "react";


export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
 
  const isAuth = useAuthenticated();

 

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Only redirect to login if not authenticated and not on auth routes
        if (!isAuth ) {
          await router.push("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [isAuth, router]);

  // Show loading only for protected routes when checking auth
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex space-x-2">
          <div className="w-6 h-6 rounded-full bg-primary animate-[moveRight_1s_infinite_0ms] relative" />
          <div className="w-6 h-6 rounded-full bg-primary/40 animate-[moveLeft_1s_infinite_0ms] relative" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main>{children}</main>
      </div>
    </div>
  );
}
