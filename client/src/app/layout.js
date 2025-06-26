import localFont from "next/font/local";
import "./globals.css";
import Providers from "@/components/Providers";

const quicksand = localFont({
  src: "../../public/fonts/Quicksand-Regular.ttf",
  variable: "--font-quicksand",
  display: "swap",
});

const quicksandSemiBold = localFont({
  src: "../../public/fonts/Quicksand-SemiBold.ttf",
  variable: "--font-quicksand-semi-bold",
  display: "swap",
});

const anekbangla = localFont({
  src: "../../public/fonts/BalooDa2-VariableFont_wght.ttf",
  variable: "--font-anekbangla",
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
      <body
        className={`${anekbangla.className} ${quicksand.className} ${quicksandSemiBold.className}`}
      >
        <Providers>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
