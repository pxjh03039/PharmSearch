"use client";

import AuthProvider from "./providers/AuthProvider";
import QueryClientProvider from "./providers/QueryClientProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <QueryClientProvider>{children}</QueryClientProvider>
    </AuthProvider>
  );
}
