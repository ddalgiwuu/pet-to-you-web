import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Providers } from "@/components/providers/Providers"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Pet to You - Business Dashboard",
  description: "Pet service provider dashboard for groomers, trainers, and sitters",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
