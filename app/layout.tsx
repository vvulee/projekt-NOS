import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Crypto Signatures App",
  description: "Web aplikacija za kriptiranje i digitalne potpise",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
