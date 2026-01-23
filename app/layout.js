import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata = {
  title: "Somework - Meta Ads & AI Builder",
  description: "Meta Ads marketer yang suka ngoding & bikin tools pake AI. Resource praktis soal Facebook Ads, automation, dan internal tools.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" style={{ scrollBehavior: "smooth" }}>
      <body className={`${spaceGrotesk.variable} ${inter.variable}`}>
        {children}
      </body>
    </html>
  );
}
