import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'

import '@/styles/globals.css'
import { ThemeProvider } from '@/components/theme-provider'

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope'
})

export const metadata: Metadata = {
  title: 'All Connected',
  description:
    'All Connected is a platform that connects people, businesses, and communities.'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  /**
   * If you do not add suppressHydrationWarning to your <html>
   * you will get warnings because next-themes updates that element.
   * This property only applies one level deep, so it won't block
   * hydration warnings on other elements.
   *
   * The div with the class of "relative flex h-screen flex-col" is used to
   * fix the data-overlay-container="true" from NextUI that is causing the
   * layout to be broken.
   */
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${manrope.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
