import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SFR Commercial Intelligence Platform",
  description: "B2B SME Commercial Decision & Value Realisation Layer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
