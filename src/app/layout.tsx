import type { Metadata } from 'next'
import { Merriweather, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ToastContainer } from 'react-toastify'

const merriweather = Merriweather({
  variable: '--font-classic',
  subsets: ['latin'],
  weight: ['300', '400', '700']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  appleWebApp: {
    title: 'My Monsters'
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon1.png', type: 'image/png' },
      { url: '/icon0.svg', type: 'image/svg+xml' }
    ],
    apple: [{ url: '/apple-icon.png' }]
  }
}

export default function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode
}>): React.ReactNode {
  return (
    <html lang='fr'>
      <body
        className={`${merriweather.variable} ${geistMono.variable} antialiased font-sans`}
      >
        {children}
        <ToastContainer />
      </body>
    </html>
  )
}
