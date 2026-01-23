"use client";

import { useAuthenticated } from "@/hooks/useAuthentication";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const isAuth = useAuthenticated();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (isAuth) {
          await router.push("/dashboard");
        }
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [isAuth, router]);

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

  // Only render auth pages if user is not authenticated
  if (!isAuth) {
    return <>{children}</>;
  }

  // Return null while redirecting authenticated users
  return null;
}