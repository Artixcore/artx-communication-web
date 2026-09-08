import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'ARTX', template: '%s · ARTX' },
  description: 'A secure network for knowledge, research, building and collaboration.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>
}
