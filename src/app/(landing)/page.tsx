"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import AboutSection from "@/components/AboutSection"
import Hero from "@/components/Landing-Hero"
import Footer from "@/components/Landing-Footer"
import LandingNavbar from "@/components/Landing-Nav"

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/feed')
    }
  }, [status, router])

  if (status === 'loading' || session) return null

  return (
    <>
      <LandingNavbar />
      <Hero />
      <AboutSection />
      <Footer />
    </>
  )
}
