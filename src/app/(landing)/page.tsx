"use client"

import AboutSection from "@/components/AboutSection"
import Hero from "@/components/Landin-Hero"
import Footer from "@/components/Landing-Footer"
import LandingNavbar from "@/components/Landing-Nav"

// src/app/page.tsx
export default function HomePage() {
  return (
    <>
      <LandingNavbar/>
      <Hero/>
      <AboutSection/>
      <Footer/>
    </>
  )
}

