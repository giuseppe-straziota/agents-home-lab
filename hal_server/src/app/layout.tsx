'use client'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Home from "@/app/page";
import {useEffect} from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout() {

   useEffect(()=>{
       console.info(
           'Made with %c♥%c by Giuseppe',
           'color: #e25555', 'color: unset'
       );
   })

  return (
      <html lang="en">
      <head>
          <meta charSet="UTF-8"/>
          <link rel="icon" type="image/svg+xml" href="/bot.svg"/>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>Agents Home Lab Server</title>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <Home/>
      </body>
      </html>
  );
}
