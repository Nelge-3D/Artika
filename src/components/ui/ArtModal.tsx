'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Bookmark, Share2, Heart, MessageCircle } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ArtModal({
  artwork,
  similarArtworks,
  onClose,
}: {
  artwork: {
    image: string
    title: string
    artist: string
    tools: string[]
  }
  similarArtworks: {
    id: string
    image: string
    title: string
  }[]
  onClose: () => void
}) {
  const modalRef = useRef(null)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'auto'
    }
  }, [onClose])

  const handleClickOutside = (e: React.MouseEvent) => {
    if (modalRef.current && !(modalRef.current as any).contains(e.target)) {
      onClose()
    }
  }

  if (!artwork) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center overflow-y-auto px-2 md:px-4"
        onClick={handleClickOutside}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-6xl mx-auto bg-white md:mt-10 rounded-xl shadow-2xl overflow-hidden md:max-h-[95vh] md:overflow-y-auto"
          ref={modalRef}
        >
          {/* Bouton de fermeture */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 text-white text-3xl font-bold z-40 hover:text-gray-300"
          >
            &times;
          </button>

          {/* Image principale */}
          <div className="relative w-full aspect-video bg-black">
            <Image
              src={artwork.image}
              alt={artwork.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80" />

            {/* Texte + lien artiste */}
            <div className="absolute bottom-8 left-8 z-20 text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{artwork.title}</h1>
              <Link
                href={`/artist/${artwork.artist.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-blue-300 hover:underline text-lg"
              >
                Voir les œuvres de {artwork.artist}
              </Link>
            </div>

            {/* Boutons latéraux */}
            <div className="absolute top-4 right-4 md:top-1/2 md:-translate-y-1/2 flex md:flex-col space-x-2 md:space-x-0 md:space-y-4 z-20">
              <button className="bg-white/90 rounded-full p-2 hover:bg-white">
                <Bookmark className="text-black w-5 h-5" />
              </button>
              <button className="bg-white/90 rounded-full p-2 hover:bg-white">
                <Share2 className="text-black w-5 h-5" />
              </button>
              <button className="bg-blue-600 rounded-full p-2 hover:bg-blue-700">
                <Heart className="text-white w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Infos complémentaires */}
          <div className="bg-white px-6 pt-6 pb-10">
            {/* Outils utilisés */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Outils utilisés</h3>
              <div className="flex flex-wrap gap-2">
                {artwork.tools.map((tool, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Boutons like/commenter */}
            <div className="flex gap-4 mb-6">
              <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition">
                <Heart className="w-4 h-4 text-pink-600" />
                <span className="text-sm text-gray-700">J’aime</span>
              </button>
              <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition">
                <MessageCircle className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">Commenter</span>
              </button>
            </div>

            {/* Grille responsive des œuvres similaires */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Œuvres similaires</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {similarArtworks.map((art) => (
                  <div
                    key={art.id}
                    className="group border rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="relative w-full aspect-[4/5] overflow-hidden">
                      <Image
                        src={art.image}
                        alt={art.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-3">
                      <p className="font-semibold text-sm text-gray-800">{art.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
