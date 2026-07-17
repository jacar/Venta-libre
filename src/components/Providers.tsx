"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import FirebaseSync from "@/components/FirebaseSync";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <FirebaseSync />
      {children}
    </SessionProvider>
  );
}
