'use client'

import Link from 'next/link'
import { Home, Upload, User, Compass, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', icon: <Home size={20} />, label: 'Accueil' },
  { href: '/upload', icon: <Upload size={20} />, label: 'Publier' },
  { href: '/explore', icon: <Compass size={20} />, label: 'Explorer' },
  { href: '/auth/login', icon: <User size={20} />, label: 'Se connecter' },
]

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  // Gérer le scroll pour la navbar mobile
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fermer le menu mobile lors du changement de route
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Vérifier si un lien est actif
  const isActiveLink = (href: string) => {
    if (href === '/' && pathname === '/') return true
    if (href !== '/' && pathname.startsWith(href)) return true
    return false
  }

  return (
    <>
      {/* Navbar Desktop - Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-16 xl:w-20 bg-white border-r shadow-md flex-col items-center py-6 gap-8 z-40">
        {/* Logo */}
        <Link href="/" className="hover:scale-105 transition-transform duration-200">
          <div className="w-10 h-10 xl:w-12 xl:h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 p-0.5 shadow-lg">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="w-6 h-6 xl:w-8 xl:h-8 object-contain"
              />
            </div>
          </div>
        </Link>

        <nav className="flex flex-col gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex justify-center items-center p-3 rounded-lg transition-all duration-200 ${
                isActiveLink(item.href)
                  ? 'text-blue-600 bg-blue-50 shadow-sm'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              {item.icon}
              <span className="absolute left-16 xl:left-20 z-10 scale-0 rounded-lg bg-gray-900 px-3 py-2 text-sm text-white transition-all group-hover:scale-100 whitespace-nowrap shadow-lg">
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Navbar Mobile - Top Bar */}
      <nav className={`lg:hidden fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white'
      }`}>
        {/* Menu Mobile Dropdown */}
        <div className={`absolute top-full left-0 right-0 bg-white border-t shadow-lg transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}>
          <div className="px-4 py-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActiveLink(item.href)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Bottom Navigation Mobile (Alternative) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
                isActiveLink(item.href)
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {item.icon}
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}

export default Navbar