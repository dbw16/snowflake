import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Snowflake - Medium Engineering Growth Framework',
  description: 'Interactive tool for tracking engineering growth and skills development',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}