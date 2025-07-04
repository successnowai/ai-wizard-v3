import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { Toaster } from '@/components/ui/Toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DevNOW Platform - AI-Powered Client Onboarding',
  description: 'Automate client onboarding and project execution with AI-powered wizards and intelligent agents.',
  keywords: 'AI, client onboarding, project management, automation, web development',
  authors: [{ name: 'SuccessNOW DevNOW Division' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#007BFF" />
      </head>
      <body className={`${inter.className} bg-soft-gray min-h-screen`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
