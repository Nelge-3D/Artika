// src/components/landing-navbar.tsx
import Link from 'next/link'

export default function LandingNavbar() {
  return (
    <header className="fixed top-0 w-full bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-blue-600">Artika</h1>
        <nav className="flex gap-6 text-sm">
          <Link href="#artists" className="hover:text-blue-600">Nos artistes</Link>
          <Link href="#about" className="hover:text-blue-600">À propos</Link>
        </nav>
        <div className="flex gap-4 text-sm">
          <Link href="/auth/login" className="text-blue-600 hover:underline">Se connecter</Link>
          <Link href="/auth/register" className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">S’inscrire</Link>
        </div>
      </div>
    </header>
  )
}
