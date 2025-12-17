import type { Metadata, Viewport } from "next";
import "./globals.css";
import ServiceWorkerClient from "@/components/ServiceWorkerClient";

export const metadata: Metadata = {
  title: "PFA - Personal Finance Agent",
  description: "Intelligent personal finance management with Plaid",
  manifest: "/manifest.webmanifest",
  themeColor: "#0f766e",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50">
        <ServiceWorkerClient />
        {children}
      </body>
    </html>
  );
}

