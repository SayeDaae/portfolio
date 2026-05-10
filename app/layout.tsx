import type { Metadata } from 'next'
import { Inter, Playfair_Display, Syne } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { StarField } from "@/components/StarField"
import { UFO } from "@/components/UFO"

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  weight: ['400', '500', '600']
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair',
  weight: ['700', '800', '900']
});

const syne = Syne({ 
  subsets: ["latin"],
  variable: '--font-syne',
  weight: ['700', '800']
});

export const metadata: Metadata = {
  title: 'Jesu Santos | Web Developer & Instructional Designer',
  description: 'Web Developer & Instructional Designer based in the Philippines. I build web experiences and learning platforms that are fast, functional, and worth remembering.',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${syne.variable} scroll-smooth`}>
      <body className="font-sans antialiased">
        <StarField />
        <UFO />
        <div className="relative z-10">
          {children}
        </div>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}