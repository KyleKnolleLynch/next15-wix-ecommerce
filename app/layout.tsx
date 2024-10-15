import type { Metadata } from 'next'
import localFont from 'next/font/local'
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
    <html lang='en'>
      <body className={`${notoSansDisplay.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
