import localFont from "next/font/local";
import ThemeProviders from "@/components/ThemeProvider";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import "./globals.css";

const quicksand = localFont({
  src: "../../public/fonts/Quicksand-Regular.ttf",
  variable: "--font-quicksand",
  display: "swap",
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${quicksand.className} bg-gray-50 text-gray-900`}>
        <ThemeProviders>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />  
        </ThemeProviders>
      </body>
    </html>
  );
}
