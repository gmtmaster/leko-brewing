import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LEKO Brewing Co.",
  description: "A cinematic premium craft beer homepage for LEKO Brewing Co."
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
