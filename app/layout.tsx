import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/layout/navbar"
import { AuthProvider } from "@/hooks/use-auth"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ESPACERO - Prenájom priestorov na Slovensku",
  description:
    "Nájdite perfektný priestor pre vašu súkromnú udalosť, oslavu, firemné podujatie alebo akúkoľvek príležitosť",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sk">
      <body className={inter.className}>
        <AuthProvider>
          <Suspense
            fallback={
              <div className="min-h-screen bg-gray-50">
                <div className="animate-pulse">
                  <div className="h-16 bg-gray-200"></div>
                  <div className="container mx-auto px-4 py-8">
                    <div className="h-8 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            }
          >
            <Navbar />
            <main>{children}</main>
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  )
}
