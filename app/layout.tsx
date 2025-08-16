import { type Metadata } from 'next'
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Footer } from '../components/common/Footer'
import Navbar from '../components/common/Navbar'
import { Suspense } from 'react'
import { NavbarSkeleton } from '../components/skeletons/navbar-skeleton'

export const metadata: Metadata = {
  title: 'Alumni Hub',
  description: 'A platform to connect alumni and share experiences of DKSM',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`antialiased`}>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            {children}
            <Footer />
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}