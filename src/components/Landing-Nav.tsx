'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import emailjs from 'emailjs-com'

export default function LandingNavbar() {
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSent, setIsSent] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Gère le scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault()
    emailjs.send(
      'service_xtljuc5',
      'template_9x75m6i',
      {
        from_name: formData.name,
        reply_to: formData.email,
        message: formData.message,
      },
      'XPCv6V8I45kCopLxC'
    )
    .then(() => {
      setIsSent(true)
      setFormData({ name: '', email: '', message: '' })
      setTimeout(() => {
        setIsSent(false)
        setShowModal(false)
      }, 2000)
    })
    .catch((err) => {
      console.error(err)
    })
  }

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? 'bg-white shadow-md' : 'bg-white/10 shadow-sm'
        }`}

      >
        <div className="mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className={`text-xl font-bold transition-colors duration-300 ${scrolled ? 'text-blue-600' : 'text-white'}`}>
            ArTika
          </h1>

          {/* Menu desktop */}
          <nav className="hidden md:flex gap-6 items-center">
            <Link href="#artists" className={`hover:text-blue-600 transition-colors ${scrolled ? 'text-gray-700' : 'text-white'}`}>
              Nos artistes
            </Link>
            <Link href="#about" className={`hover:text-blue-600 transition-colors ${scrolled ? 'text-gray-700' : 'text-white'}`}>
              À propos
            </Link>
            <button
              onClick={() => setShowModal(true)}
              className={`hover:underline transition-colors ${scrolled ? 'text-blue-600' : 'text-white'}`}
            >
              Nous contacter
            </button>
            <div className="flex gap-3 ml-4">
              <Link href="/auth/login" className={`hover:underline transition-colors ${scrolled ? 'text-blue-600' : 'text-white'}`}>
                Se connecter
              </Link>
              <Link
                href="/auth/register"
                className="bg-purple-600 text-white px-4 py-1 rounded-full hover:bg-purple-700"
              >
                S&apos;inscrire
              </Link>
            </div>
          </nav>

          {/* Hamburger */}
          <button
            className={`md:hidden transition-colors ${scrolled ? 'text-blue-600' : 'text-white'}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden bg-white"
            >
              <div className="px-6 pb-4 space-y-4">
                <Link
                  href="#artists"
                  className="block text-gray-800 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Nos artistes
                </Link>
                <Link
                  href="#about"
                  className="block text-gray-800 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  À propos
                </Link>
                <button
                  onClick={() => {
                    setShowModal(true)
                    setMobileMenuOpen(false)
                  }}
                  className="text-blue-600 hover:underline"
                >
                  Nous contacter
                </button>
                <div className="flex gap-3 pt-2">
                  <Link
                    href="/auth/login"
                    className="text-blue-600 hover:underline"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Se connecter
                  </Link>
                  <Link
                    href="/auth/register"
                    className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    S&apos;inscrire
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Modal Contact */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold mb-4 text-blue-600">Nous contacter</h2>

              {isSent ? (
                <p className="text-green-600 font-medium text-center">Message envoyé avec succès !</p>
              ) : (
                <form onSubmit={sendEmail} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Votre nom"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded"
                  />
                  <input
                    type="email"
                    placeholder="Votre email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border rounded"
                  />
                  <textarea
                    placeholder="Votre message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2 border rounded"
                  ></textarea>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
                  >
                    Envoyer
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
