'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import emailjs from '@emailjs/browser'
import { useSession } from 'next-auth/react'

const SEND_COOLDOWN_MS = 60_000 // 1 minute entre deux envois

export default function LandingNavbar() {
  const { data: session } = useSession()
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', message: '', website: '' })
  const [isSent, setIsSent] = useState(false)
  const [sendError, setSendError] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const lastSentAt = useRef<number>(0)

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
    setSendError('')

    // Honeypot : si le champ caché est rempli, c'est un bot
    if (formData.website) return

    // Validation longueurs
    if (formData.name.trim().length === 0 || formData.name.length > 100) {
      setSendError('Nom invalide (1–100 caractères)')
      return
    }
    if (formData.message.trim().length === 0 || formData.message.length > 2000) {
      setSendError('Message invalide (1–2000 caractères)')
      return
    }

    // Cooldown : 1 envoi max par minute
    const now = Date.now()
    if (now - lastSentAt.current < SEND_COOLDOWN_MS) {
      const remaining = Math.ceil((SEND_COOLDOWN_MS - (now - lastSentAt.current)) / 1000)
      setSendError(`Veuillez patienter ${remaining} secondes avant de renvoyer.`)
      return
    }

    lastSentAt.current = now

    emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
      {
        from_name: formData.name,
        reply_to: formData.email,
        message: formData.message,
      },
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
    )
    .then(() => {
      setIsSent(true)
      setFormData({ name: '', email: '', message: '', website: '' })
      setTimeout(() => {
        setIsSent(false)
        setShowModal(false)
      }, 2000)
    })
    .catch(() => {
      setSendError('Erreur lors de l\'envoi. Veuillez réessayer.')
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
              {session ? (
                <Link
                  href="/feed"
                  className="bg-purple-600 text-white px-5 py-2 rounded-full hover:bg-purple-700 font-medium"
                >
                  Accéder au feed →
                </Link>
              ) : (
                <>
                  <Link href="/auth/login" className={`hover:underline transition-colors ${scrolled ? 'text-blue-600' : 'text-white'}`}>
                    Se connecter
                  </Link>
                  <Link
                    href="/auth/register"
                    className="bg-purple-600 text-white px-4 py-1 rounded-full hover:bg-purple-700"
                  >
                    S&apos;inscrire
                  </Link>
                </>
              )}
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
                  {session ? (
                    <Link
                      href="/feed"
                      className="bg-purple-600 text-white px-5 py-2 rounded-full hover:bg-purple-700 font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Accéder au feed →
                    </Link>
                  ) : (
                    <>
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
                    </>
                  )}
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
                  {/* Honeypot — caché aux humains, rempli par les bots */}
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    style={{ display: 'none' }}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                  <input
                    type="text"
                    placeholder="Votre nom"
                    required
                    maxLength={100}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded"
                  />
                  <input
                    type="email"
                    placeholder="Votre email"
                    required
                    maxLength={320}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border rounded"
                  />
                  <textarea
                    placeholder="Votre message"
                    required
                    rows={4}
                    maxLength={2000}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2 border rounded"
                  />
                  {sendError && (
                    <p className="text-red-500 text-sm">{sendError}</p>
                  )}
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
