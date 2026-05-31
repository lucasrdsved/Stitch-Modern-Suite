import type { Metadata } from 'next'
import { Inter, Bebas_Neue } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

const bebasNeue = Bebas_Neue({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas-neue'
})

export const metadata: Metadata = {
  title: 'Trainflow - Modern Fitness Suite',
  description: 'Suite completa de aplicativos para personal trainers e alunos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`dark ${inter.variable} ${bebasNeue.variable}`}>
      <body className="bg-background antialiased">{children}</body>
    </html>
  )
}
