import "@/styles/globals.css";
import { Manrope, Orbitron } from "next/font/google";
import { SyncProvider } from "@/context/syncContext";

export const metadata = {
  title: "Roboto",
  description: "Bot de trading automatique",
};

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-manrope",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-orbitron",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${manrope.variable} ${orbitron.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-background text-text font-sans">
        <SyncProvider>{children}</SyncProvider>
      </body>
    </html>
  );
}
