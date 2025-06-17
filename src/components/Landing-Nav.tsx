'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import emailjs from 'emailjs-com'

export default function LandingNavbar() {
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSent, setIsSent] = useState(false)

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
      <header className="fixed top-0 w-full bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap gap-4 items-center justify-between">
          <h1 className="text-xl font-bold text-blue-600">Artika</h1>

          <nav className="flex gap-4 text-sm flex-wrap">
            <Link href="#artists" className="hover:text-blue-600">Nos artistes</Link>
            <Link href="#about" className="hover:text-blue-600">À propos</Link>
            <button
              onClick={() => setShowModal(true)}
              className="text-blue-600 hover:underline"
            >
              Nous contacter
            </button>
          </nav>

          <div className="flex gap-3 text-sm">
            <Link href="/auth/login" className="text-blue-600 hover:underline">Se connecter</Link>
            <Link href="/auth/register" className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
              S’inscrire
            </Link>
          </div>
        </div>
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
