"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { sfPro } from "./fonts";

const queryClient = new QueryClient();

function AppWrapper({ children }: { children: React.ReactNode }) {
    return (
          <QueryClientProvider client={queryClient}>
                <div className={`${sfPro.className}`}>
                    {children}
                </div>
          </QueryClientProvider>
    );
}

export default AppWrapper;