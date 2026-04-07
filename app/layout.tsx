import type { Metadata } from "next";
import { Bodoni_Moda, Pinyon_Script } from "next/font/google";
import "./globals.css";
import { weddingConfig } from "../lib/weddingConfig"; // දත්ත ගොනුව Import කිරීම

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  weight: ["400", "700"],
});

const pinyon = Pinyon_Script({
  subsets: ["latin"],
  variable: "--font-pinyon",
  weight: "400",
});

// Dynamic Title based on config
export const metadata: Metadata = {
  title: `${weddingConfig.coupleFullName} | A Celebration of Love`,
  description: "Together with our families, we invite you to our wedding.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bodoni.variable} ${pinyon.variable} font-bodoni text-gray-800 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}