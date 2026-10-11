import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevCommunity",
  description:
    "A community platform for developers to learn, share knowledge, and connect.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0B1120] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
