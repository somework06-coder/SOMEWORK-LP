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

import { supabase } from "@/lib/supabase";

export async function generateMetadata() {
  const { data } = await supabase.from("site_config").select("*");
  const settings = {};

  if (data) {
    data.forEach((item) => {
      settings[item.key] = item.value;
    });
  }

  const title = settings.hero_name
    ? `${settings.hero_name} - Meta Ads & AI Builder`
    : "Somework - Meta Ads & AI Builder";

  const description = settings.hero_tagline || "Meta Ads marketer yang suka ngoding & bikin tools pake AI.";

  return {
    title: title,
    description: description,
    icons: {
      icon: '/logo.png',
      shortcut: '/logo.png',
      apple: '/logo.png',
    },
    openGraph: {
      title: title,
      description: description,
      url: 'https://somework.id', // Bisa diganti domain asli nanti
      siteName: 'Somework',
      images: [
        {
          url: '/logo.png', // Idealnya gambar OG khusus ukuran 1200x630, tapi logo dulu gapapa
          width: 800,
          height: 800,
        },
      ],
      locale: 'id_ID',
      type: 'website',
    },
  };
}

import PageViewTracker from "@/components/PageViewTracker";

export default function RootLayout({ children }) {
  return (
    <html lang="id" style={{ scrollBehavior: "smooth" }}>
      <body className={`${spaceGrotesk.variable} ${inter.variable}`}>
        <PageViewTracker />
        {children}
      </body>
    </html>
  );
}
