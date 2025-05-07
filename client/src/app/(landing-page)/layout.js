import localFont from "next/font/local";
import ThemeProviders from "@/components/ThemeProvider";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

const quicksand = localFont({
  src: "../../../public/fonts/Quicksand-Regular.ttf",
  variable: "--font-quicksand",
  display: "swap",
});

export const metadata = {
  title: "Jiggasha",
  description: "Jiggasha is a platform for learning and sharing knowledge.",
};

export default function RootLayout({ children }) {
  return (
    <div>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </div>
  );
}
