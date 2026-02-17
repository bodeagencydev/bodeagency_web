import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UGC Concept Generator",
  description: "Turn any product into a UGC ad concept in seconds."
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
