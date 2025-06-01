// components/Providers.js
"use client";
import { SessionProvider } from "next-auth/react";
import ThemeProviders from "./ThemeProvider";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <ThemeProviders>{children}</ThemeProviders>
    </SessionProvider>
  );
}
