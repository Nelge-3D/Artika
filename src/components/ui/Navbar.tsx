'use client'

import Link from 'next/link'
import { Home, Upload, User, Compass, LogOut, Settings } from 'lucide-react'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const pathname = usePathname()
  const { data: session, status } = useSession()

  // Navigation items pour utilisateurs non connectés
  const guestNavItems = [
    { href: '/', icon: <Home size={20} />, label: 'Accueil' },
    { href: '/explore', icon: <Compass size={20} />, label: 'Explorer' },
    { href: '/auth/login', icon: <User size={20} />, label: 'Se connecter' },
  ]

  // Navigation items pour utilisateurs connectés
  const userNavItems = [
    { href: '/dashboard', icon: <Home size={20} />, label: 'Dashboard' },
    { href: '/feed', icon: <Compass size={20} />, label: 'Feed' },
    { href: '/upload', icon: <Upload size={20} />, label: 'Publier' },
    { href: '/explore', icon: <Compass size={20} />, label: 'Explorer' },
  ]

  // Choisir les items de navigation selon l'état de connexion
  const navItems = session ? userNavItems : guestNavItems

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
    setShowUserMenu(false)
  }, [pathname])

  // Fermer les menus en cliquant ailleurs
  useEffect(() => {
    const handleClickOutside = () => {
      setShowUserMenu(false)
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  // Vérifier si un lien est actif
  const isActiveLink = (href: string) => {
    if (href === '/' && pathname === '/') return true
    if (href !== '/' && pathname.startsWith(href)) return true
    return false
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  const getUserDisplayName = () => {
    if (session?.user?.name) return session.user.name
    if (session?.user?.firstName && session?.user?.lastName) {
      return `${session.user.firstName} ${session.user.lastName}`
    }
    return session?.user?.email?.split('@')[0] || 'Utilisateur'
  }

  const getUserInitials = () => {
    const name = getUserDisplayName()
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
  }

  return (
    <>
      {/* Navbar Desktop - Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-16 xl:w-20 bg-white border-r shadow-md flex-col items-center py-6 gap-8 z-40">
        {/* Logo */}
        <Link href="/" className="hover:scale-105 transition-transform duration-200">
          <div className="w-10 h-10 xl:w-12 xl:h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 p-0.5 shadow-lg">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
              <Image
                src="/logo.png" 
                alt="Logo" 
                width={32}
                height={32}
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

        {/* User Menu Desktop */}
        {session && (
          <div className="mt-auto relative">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowUserMenu(!showUserMenu)
              }}
              className="group relative flex justify-center items-center p-3 rounded-lg transition-all duration-200 text-gray-600 hover:text-blue-600 hover:bg-gray-50"
            >
              <div className="w-6 h-6 xl:w-8 xl:h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white text-xs xl:text-sm font-medium">
                {getUserInitials()}
              </div>
              <span className="absolute left-16 xl:left-20 z-10 scale-0 rounded-lg bg-gray-900 px-3 py-2 text-sm text-white transition-all group-hover:scale-100 whitespace-nowrap shadow-lg">
                {getUserDisplayName()}
              </span>
            </button>

            {/* Dropdown Menu Desktop */}
            {showUserMenu && (
              <div className="absolute left-16 xl:left-20 bottom-0 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
                <div className="px-4 py-2 border-b">
                  <p className="font-medium text-gray-900 text-sm">{getUserDisplayName()}</p>
                  <p className="text-xs text-gray-500">{session.user?.email}</p>
                </div>
                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Settings size={16} />
                  <span className="text-sm">Profil</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                >
                  <LogOut size={16} />
                  <span className="text-sm">Se déconnecter</span>
                </button>
              </div>
            )}
          </div>
        )}
      </aside>

      {/* Navbar Mobile - Top Bar */}
      <nav className={`lg:hidden fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white'
      }`}>
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo Mobile */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 p-0.5">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                <Image
                  src="/logo.png" 
                  alt="Logo" 
                  width={24}
                  height={24}
                  className="w-5 h-5 object-contain"
                />
              </div>
            </div>
            <span className="font-bold text-gray-900">ArTika</span>
          </Link>

          {/* User Info Mobile */}
          {session ? (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowUserMenu(!showUserMenu)
              }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white text-xs font-medium">
                {getUserInitials()}
              </div>
              <span className="text-sm font-medium text-gray-900">{getUserDisplayName()}</span>
            </button>
          ) : (
            <Link
              href="/auth/login"
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
            >
              <User size={20} />
              <span className="text-sm font-medium">Connexion</span>
            </Link>
          )}
        </div>

        {/* Mobile User Menu Dropdown */}
        {session && showUserMenu && (
          <div className="absolute top-full left-0 right-0 bg-white border-t shadow-lg">
            <div className="px-4 py-2 border-b">
              <p className="font-medium text-gray-900">{getUserDisplayName()}</p>
              <p className="text-sm text-gray-500">{session.user?.email}</p>
            </div>
            <div className="px-4 py-2">
              <Link
                href="/profile"
                className="flex items-center gap-3 py-2 text-gray-700 hover:text-blue-600"
              >
                <Settings size={16} />
                <span>Profil</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 py-2 text-red-600 hover:text-red-700 w-full text-left"
              >
                <LogOut size={16} />
                <span>Se déconnecter</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Bottom Navigation Mobile */}
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
      {(isMobileMenuOpen || showUserMenu) && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => {
            setIsMobileMenuOpen(false)
            setShowUserMenu(false)
          }}
        />
      )}
    </>
  )
}

export default Navbar