import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import Navbar from './navbar'
import Footer from './footer'
import ReactQueryProvider from './react-query-provider'
import { Toaster } from '@/components/ui/toaster'

const notoSansDisplay = localFont({
  src: './fonts/NotoSansDisplayVF.woff2',
  variable: '--font-noto-sans-display',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: {
    template: '%s | Modern Wearables',
    absolute: 'Modern Wearables',
  },
  description: 'Ecommerce application built with Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={`${notoSansDisplay.variable} font-sans antialiased`}>
        <ReactQueryProvider>
          <Navbar />
          {children}
          <Footer />
        </ReactQueryProvider>
        <Toaster />
      </body>
    </html>
  )
}
