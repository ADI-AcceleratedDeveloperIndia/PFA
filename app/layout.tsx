import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PFA - Personal Finance Agent",
  description: "Intelligent personal finance management with Plaid",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50">{children}</body>
    </html>
  );
}

