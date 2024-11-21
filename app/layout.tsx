import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { ThemeProvider } from 'next-themes'
import ReactQueryProvider from './react-query-provider'
import Navbar from './navbar'
import Footer from './footer'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

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
    <html lang='en' suppressHydrationWarning>
      <body className={`${notoSansDisplay.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem={true}
          disableTransitionOnChange
        >
          <ReactQueryProvider>
            <Navbar />
            {children}
            <Footer />
          </ReactQueryProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
