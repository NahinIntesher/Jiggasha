import { Metadata } from "next";
import localFont from "next/font/local";
import ThemeProviders from "@/components/ThemeProvider";
import "./globals.css";

const quicksand = localFont({
  src: "../../public/fonts/Quicksand-Regular.ttf",
  variable: "--font-quicksand",
  weight: "400 900",
});

export const metadata = {
  title: "Jiggasha",
  description: "Jiggasha is a platform for learning and sharing knowledge.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/JiggashaLogo.png" type="image/png" />
      </head>
      <body className={`${quicksand.className}`}>
        <ThemeProviders>{children}</ThemeProviders>
      </body>
    </html>
  );
}
