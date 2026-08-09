import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "2go 2.0",
  description: "A modern social network for discovering who's around right now.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
