'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Bookmark, Share2, Heart, MessageCircle, Eye, Tag, ExternalLink, X, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { slugify } from '@/lib/slugify'
import UserAvatar from '@/components/ui/UserAvatar'

interface ArtworkData {
  id: string
  image: string
  title: string
  artist: string
  artistImage?: string | null
  tools: string[]
  popularity?: number
  category?: string
  year?: number
  likes?: number
  views?: number
  description?: string
}

interface SimilarArtwork {
  id: string
  image: string
  title: string
  artist: string
  category?: string
}

export default function ArtModal({
  artwork,
  similarArtworks,
  onClose,
}: {
  artwork: ArtworkData
  similarArtworks: SimilarArtwork[]
  onClose: () => void
}) {
  const backdropRef = useRef<HTMLDivElement>(null)
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [likesCount, setLikesCount] = useState(artwork.likes || 0)
  const [showComments, setShowComments] = useState(false)
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('landscape')

  // Détection orientation
  useEffect(() => {
    const img = new window.Image()
    img.onload = () => {
      setOrientation(img.naturalWidth >= img.naturalHeight ? 'landscape' : 'portrait')
    }
    img.src = artwork.image
  }, [artwork.image])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const isLandscape = orientation === 'landscape'

  const InfoPanel = () => (
    <div className="flex flex-col gap-5 p-6 overflow-y-auto">
      {/* Artiste */}
      <div className="flex items-center justify-between">
        <Link
          href={`/artist/${slugify(artwork.artist)}`}
          onClick={onClose}
          className="flex items-center gap-3 group"
        >
          <UserAvatar name={artwork.artist} src={artwork.artistImage} size={44} />
          <div>
            <p className="font-semibold text-gray-900 group-hover:text-purple-600 transition text-sm">
              {artwork.artist}
            </p>
            <p className="text-xs text-gray-400 flex items-center gap-1">
              Voir le profil <ExternalLink className="w-3 h-3" />
            </p>
          </div>
        </Link>
        <button
          onClick={() => { setIsSaved(!isSaved) }}
          className={`p-2 rounded-full transition ${isSaved ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Titre + meta */}
      <div>
        <div className="flex flex-wrap gap-2 mb-2">
          {artwork.category && (
            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
              {artwork.category}
            </span>
          )}
          {artwork.year && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
              {artwork.year}
            </span>
          )}
        </div>
        <h2 className="text-xl font-bold text-gray-900 leading-tight">{artwork.title}</h2>
      </div>

      {/* Description */}
      {artwork.description && (
        <p className="text-gray-600 text-sm leading-relaxed">{artwork.description}</p>
      )}

      {/* Actions like / comment */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => { setIsLiked(!isLiked); setLikesCount(p => isLiked ? p - 1 : p + 1) }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
            isLiked ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          {likesCount}
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition"
        >
          <MessageCircle className="w-4 h-4" />
          Commenter
        </button>
        <div className="ml-auto flex items-center gap-2 text-xs text-gray-400">
          <Eye className="w-4 h-4" />
          {artwork.views?.toLocaleString() || 0}
        </div>
      </div>

      {/* Outils */}
      {artwork.tools.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Outils</p>
          <div className="flex flex-wrap gap-2">
            {artwork.tools.map((tool) => (
              <span key={tool} className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium border border-purple-100">
                <Tag className="w-3 h-3" /> {tool}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Commentaires */}
      {showComments && (
        <div className="border-t pt-4">
          <p className="text-sm font-semibold text-gray-700 mb-3">Commentaires</p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ajouter un commentaire..."
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition">
              Publier
            </button>
          </div>
          <p className="text-gray-400 text-xs mt-3">Soyez le premier à commenter !</p>
        </div>
      )}

      {/* Œuvres similaires */}
      {similarArtworks.length > 0 && (
        <div className="border-t pt-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Œuvres similaires</p>
          <div className="space-y-2">
            {similarArtworks.slice(0, 3).map((art) => (
              <Link
                key={art.id}
                href={`/artist/${slugify(art.artist)}`}
                onClick={onClose}
                className="flex gap-3 items-center p-2 rounded-xl hover:bg-gray-50 transition group"
              >
                <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                  <Image src={art.image} alt={art.title} fill className="object-cover group-hover:scale-105 transition-transform duration-200" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-800 line-clamp-1">{art.title}</p>
                  <p className="text-xs text-gray-500">{art.artist}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <AnimatePresence>
      <motion.div
        ref={backdropRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={(e) => { if (e.target === backdropRef.current) onClose() }}
        aria-modal="true"
        role="dialog"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className={`relative bg-white rounded-2xl shadow-2xl overflow-hidden w-full ${
            isLandscape
              ? 'max-w-5xl flex flex-col md:flex-row max-h-[90vh]'
              : 'max-w-md flex flex-col max-h-[92vh]'
          }`}
        >
          {/* Bouton fermer */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Image */}
          {isLandscape ? (
            <div className="md:flex-1 relative bg-black min-h-[260px] md:min-h-0">
              <img
                src={artwork.image}
                alt={artwork.title}
                className="w-full h-full object-contain md:absolute md:inset-0"
              />
              {/* Stats overlay */}
              <div className="absolute top-3 left-3 flex gap-2">
                {artwork.views ? (
                  <span className="flex items-center gap-1 bg-black/40 text-white text-xs px-2 py-1 rounded-full">
                    <Eye className="w-3 h-3" /> {artwork.views.toLocaleString()}
                  </span>
                ) : null}
                <span className="flex items-center gap-1 bg-black/40 text-white text-xs px-2 py-1 rounded-full">
                  <Heart className="w-3 h-3" /> {likesCount}
                </span>
              </div>
            </div>
          ) : (
            <div className="relative bg-black flex-shrink-0">
              <img
                src={artwork.image}
                alt={artwork.title}
                className="w-full h-auto block"
                style={{ maxHeight: '58vh', objectFit: 'contain' }}
              />
              <div className="absolute top-3 left-3 flex gap-2">
                {artwork.views ? (
                  <span className="flex items-center gap-1 bg-black/40 text-white text-xs px-2 py-1 rounded-full">
                    <Eye className="w-3 h-3" /> {artwork.views.toLocaleString()}
                  </span>
                ) : null}
                <span className="flex items-center gap-1 bg-black/40 text-white text-xs px-2 py-1 rounded-full">
                  <Heart className="w-3 h-3" /> {likesCount}
                </span>
              </div>
            </div>
          )}

          {/* Info panel */}
          <div className={isLandscape ? 'md:w-[340px] shrink-0 overflow-y-auto border-l' : 'overflow-y-auto flex-1'}>
            <InfoPanel />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
