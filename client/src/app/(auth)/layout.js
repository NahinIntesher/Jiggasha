import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export default function RootLayout({ children }) {
  return (
    <div>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </div>
  );
}
