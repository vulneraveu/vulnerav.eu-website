import type { Metadata } from "next";
import { Cormorant_Garamond, Newsreader, IBM_Plex_Sans } from "next/font/google";
import { Header } from "@/app/_components/header";
import { Footer } from "@/app/_components/footer";
import { PaperFilters } from "@/app/_components/paper-filters";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "vulnerav.eu",
  description: "Blog e confissões anônimas",
};

// Roda antes do primeiro paint pra aplicar o tema salvo sem flash de cor.
const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      document.documentElement.setAttribute("data-theme", stored);
    }
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${cormorant.variable} ${newsreader.variable} ${plexSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-glow flex min-h-full flex-col font-body text-ink">
        <PaperFilters />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
