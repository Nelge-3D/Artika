'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Bookmark, Share2, Heart, MessageCircle, Eye, Calendar, Tag, User, ExternalLink, Download, Flag, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Fonction slugify cohérente avec celle de la page artiste
function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export default function ArtModal({
  artwork,
  similarArtworks,
  onClose,
}: {
  artwork: {
    id: string
    image: string
    title: string
    artist: string
    tools: string[]
    popularity?: number
    category?: string
    year?: number
    likes?: number
    views?: number
    description?: string
    images?: string[]
  }
  similarArtworks: {
    id: string
    image: string
    title: string
    artist: string
    category?: string
  }[]
  onClose: () => void
}) {
  const modalRef = useRef<HTMLDivElement>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [likesCount, setLikesCount] = useState(artwork.likes || 0)
  const [showComments, setShowComments] = useState(false)

  const images = artwork.images || [artwork.image]

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
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose()
    }
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1)
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
  }

  if (!artwork) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center overflow-y-auto px-2 md:px-6 py-4"
        onClick={handleClickOutside}
        aria-modal="true"
        role="dialog"
      >
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] overflow-y-auto"
          ref={modalRef}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 rounded-full p-2 z-50 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header avec image principale */}
          <div className="relative w-full aspect-video bg-black">
            <Image
              src={images[currentImageIndex]}
              alt={artwork.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/60" />

            {/* Navigation des images si multiples */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Informations overlay */}
            <div className="absolute bottom-8 left-8 z-20 text-white max-w-2xl">
              <div className="flex items-center gap-2 mb-2">
                {artwork.category && (
                  <span className="px-2 py-1 bg-purple-600/80 rounded-full text-xs font-medium">
                    {artwork.category}
                  </span>
                )}
                {artwork.year && (
                  <span className="px-2 py-1 bg-black/50 rounded-full text-xs">
                    {artwork.year}
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{artwork.title}</h1>
              <Link
                href={`/artist/${slugify(artwork.artist)}`}
                className="text-blue-300 hover:text-blue-200 text-lg flex items-center gap-1 group"
              >
                <User className="w-4 h-4" />
                {artwork.artist}
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              {artwork.description && (
                <p className="text-white/90 mt-3 text-sm leading-relaxed line-clamp-2">
                  {artwork.description}
                </p>
              )}
            </div>

            {/* Actions flottantes */}
            <div className="absolute top-4 right-16 flex gap-2 z-40">
              <ActionIcon
                icon={<Bookmark className="w-5 h-5" />}
                onClick={handleSave}
                active={isSaved}
                className={isSaved ? 'bg-yellow-500 text-white' : 'bg-white/90 hover:bg-white text-black'}
              />
              <ActionIcon
                icon={<Share2 className="w-5 h-5" />}
                className="bg-white/90 hover:bg-white text-black"
              />
              <ActionIcon
                icon={<Download className="w-5 h-5" />}
                className="bg-white/90 hover:bg-white text-black"
              />
              <ActionIcon
                icon={<Flag className="w-5 h-5" />}
                className="bg-white/90 hover:bg-white text-black"
              />
            </div>

            {/* Statistiques overlay */}
            <div className="absolute top-4 left-4 flex gap-4 text-white/90 z-20">
              {artwork.views && (
                <div className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded-full text-sm">
                  <Eye className="w-4 h-4" />
                  <span>{artwork.views.toLocaleString()}</span>
                </div>
              )}
              <div className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded-full text-sm">
                <Heart className="w-4 h-4" />
                <span>{likesCount}</span>
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="bg-white">
            <div className="flex flex-col lg:flex-row">
              {/* Contenu principal */}
              <div className="flex-1 px-6 pt-6">
                {/* Actions utilisateur */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b">
                  <div className="flex gap-3">
                    <button
                      onClick={handleLike}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                        isLiked
                          ? 'bg-red-50 text-red-600 border border-red-200'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                      <span className="text-sm font-medium">{likesCount}</span>
                    </button>
                    <button
                      onClick={() => setShowComments(!showComments)}
                      className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition text-gray-700"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Commenter</span>
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    {artwork.popularity && (
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>{artwork.popularity}% popularité</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Détails du projet */}
                <div className="space-y-6">
                  {/* Description complète */}
                  {artwork.description && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
                      <p className="text-gray-700 leading-relaxed">{artwork.description}</p>
                    </div>
                  )}

                  {/* Outils utilisés */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Outils utilisés</h3>
                    <div className="flex flex-wrap gap-2">
                      {artwork.tools.map((tool, index) => (
                        <span
                          key={index}
                          className="flex items-center gap-1 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium border border-purple-100"
                        >
                          <Tag className="w-3 h-3" />
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Informations projet */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Informations</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {artwork.category && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Catégorie:</span>
                          <span className="font-medium">{artwork.category}</span>
                        </div>
                      )}
                      {artwork.year && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-500">Année:</span>
                          <span className="font-medium">{artwork.year}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-500">Vues:</span>
                        <span className="font-medium">{artwork.views?.toLocaleString() || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-500">Likes:</span>
                        <span className="font-medium">{likesCount}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section commentaires */}
                {showComments && (
                  <div className="mt-8 pt-6 border-t">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Commentaires</h3>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <input
                          type="text"
                          placeholder="Ajouter un commentaire..."
                          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                          Publier
                        </button>
                      </div>
                      <div className="text-gray-500 text-sm">
                        Soyez le premier à commenter cette œuvre !
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:w-80 bg-gray-50 p-6 border-l">
                {/* Profil artiste */}
                <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <Image
                      src={`/avatars/${slugify(artwork.artist)}.png`}
                      alt={artwork.artist}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <Link
                        href={`/artist/${slugify(artwork.artist)}`}
                        className="font-semibold text-gray-900 hover:text-purple-600 transition"
                      >
                        {artwork.artist}
                      </Link>
                      <p className="text-xs text-gray-500">Artiste créatif</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/artist/${slugify(artwork.artist)}`}
                      className="flex-1 bg-purple-600 text-white text-center py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition"
                    >
                      Voir le profil
                    </Link>
                    <button className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                      <MessageCircle className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Œuvres similaires */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Œuvres similaires</h3>
                  <div className="space-y-3">
                    {similarArtworks.slice(0, 4).map((art) => (
                      <Link
                        key={art.id}
                        href={`/art/${art.id}`}
                        className="flex gap-3 group bg-white rounded-lg p-3 hover:shadow-md transition-shadow"
                        onClick={onClose}
                      >
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={art.image}
                            alt={art.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-800 line-clamp-1">{art.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{art.artist}</p>
                          {art.category && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                              {art.category}
                            </span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function ActionIcon({
  icon,
  onClick,
  active = false,
  className = 'bg-white/90 hover:bg-white text-black',
}: {
  icon: React.ReactNode
  onClick?: () => void
  active?: boolean
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full p-2 transition-all shadow-md ${className} ${
        active ? 'transform scale-110' : ''
      }`}
      aria-label="action"
    >
      {icon}
    </button>
  )
}