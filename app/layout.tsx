import type React from "react"
import { Fira_Code } from "next/font/google"
import "./globals.css"

const firaCode = Fira_Code({
  subsets: ["latin"],
  display: "swap",
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  if (typeof window !== "undefined") {
    // Client-side only
    const headers = new Headers()
    headers.append("X-Frame-Options", "ALLOWALL")
    headers.append("Access-Control-Allow-Origin", "*")
  }

  return (
    <html lang="en">
      <body className={firaCode.className}>{children}</body>
    </html>
  )
}

export const metadata = {
  title: "Tariff Calculator",
  description: "Calculate import duties and tariffs",
}

