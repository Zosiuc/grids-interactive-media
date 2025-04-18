import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Boruil",
  description: "Grids interactive media",
  icons: {
        icon: '/favicon.png', // of '/favicon.png', afhankelijk van je bestand
    },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <head>
            <title>Boruil</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta property="og:title" content="Boruil" />
            <meta property="og:description" content="Grid interactive media" />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://boruil.vercel.app" />
      
            <link rel="icon" href="/favicon.png"/>
            <meta property="scrollBehavior" content="smooth"/>

        </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      <Analytics/>
      </body>
    </html>
  );
}
