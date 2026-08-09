import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://2go.local"),
  title: {
    default: "2go 2.0",
    template: "%s | 2go 2.0",
  },
  description: "A social space for seeing who's around, jumping into rooms, and talking in real time.",
  applicationName: "2go 2.0",
  keywords: ["2go", "chat", "rooms", "presence", "discovery"],
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport = {
  themeColor: "#101820",
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
