import Navbar from '@/components/ui/Navbar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Paramètres — ArTika',
  description: 'Modifiez votre profil ArTika : nom, bio, localisation et liens sociaux.',
}

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  )
}
