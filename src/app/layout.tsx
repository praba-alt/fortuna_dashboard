import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fortuna Dashboard",
  description: "Internal analytics dashboard for Fortuna token scoring."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
