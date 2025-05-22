// src/app/layout.tsx

export const metadata = {
  title: "Roboto",
  description: "Bot de trading automatique",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head />
      <body>{children}</body>
    </html>
  );
}
