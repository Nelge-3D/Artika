"use client"

import AboutSection from "@/components/AboutSection"
import Hero from "@/components/Landing-Hero"
import Footer from "@/components/Landing-Footer"
import LandingNavbar from "@/components/Landing-Nav"
import ServicesSection from "@/components/ServicesSection"

// src/app/page.tsx
export default function HomePage() {
  return (
    <>
      <LandingNavbar/>
      <Hero/>
      <AboutSection/>
      <ServicesSection/>
      <Footer/>
    </>
  )
}

