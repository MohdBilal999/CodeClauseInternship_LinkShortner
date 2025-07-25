import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LinkShrink - URL Shortener with Analytics",
  description: "Transform your long URLs into short, shareable links with detailed analytics and QR codes",
  keywords: "URL shortener, link shortener, analytics, QR code, short links",
  authors: [{ name: "LinkShrink" }],
  openGraph: {
    title: "LinkShrink - URL Shortener with Analytics",
    description: "Transform your long URLs into short, shareable links with detailed analytics and QR codes",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
