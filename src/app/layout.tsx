import type { Metadata } from 'next'
import { connection } from 'next/server'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'ARTX', template: '%s · ARTX' },
  description: 'A secure network for knowledge, research, building and collaboration.',
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await connection()
  return <html lang="en"><body>{children}</body></html>
}
