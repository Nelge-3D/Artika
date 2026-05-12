'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/ui/Navbar'
import UserAvatar from '@/components/ui/UserAvatar'
import { Upload, LogOut, Trash2, Eye, Heart, X, Tag } from 'lucide-react'

interface MyArtwork {
  id: string
  title: string
  description?: string
  image: string
  category: string
  tools: string[]
  year?: number
  likes: number
  views: number
}

/* ── Modal Pinterest-style ─────────────────────────────────────────── */
function ArtworkModal({
  artwork,
  onClose,
  onDelete,
  deleting,
}: {
  artwork: MyArtwork
  onClose: () => void
  onDelete: (id: string) => void
  deleting: boolean
}) {
  const backdropRef = useRef<HTMLDivElement>(null)
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('landscape')

  // Fermeture clavier
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  // Détection orientation dès que l'URL est connue
  useEffect(() => {
    const img = new window.Image()
    img.onload = () => {
      setOrientation(img.naturalWidth >= img.naturalHeight ? 'landscape' : 'portrait')
    }
    img.src = artwork.image
  }, [artwork.image])

  const isLandscape = orientation === 'landscape'

  return (
    <AnimatePresence>
      <motion.div
        ref={backdropRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={(e) => { if (e.target === backdropRef.current) onClose() }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className={`relative bg-white rounded-2xl overflow-hidden shadow-2xl w-full ${
            isLandscape
              ? 'max-w-5xl flex flex-col md:flex-row max-h-[90vh]'
              : 'max-w-lg flex flex-col max-h-[92vh]'
          }`}
        >
          {/* Bouton fermer */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition"
          >
            <X className="w-4 h-4" />
          </button>

          {/* ── Image ── */}
          <div
            className={
              isLandscape
                ? 'md:flex-1 relative min-h-[280px] md:min-h-0 bg-black'
                : 'relative w-full bg-black'
            }
            style={isLandscape ? undefined : { maxHeight: '60vh' }}
          >
            <img
              src={artwork.image}
              alt={artwork.title}
              className={`w-full h-full object-contain ${isLandscape ? 'md:absolute md:inset-0' : ''}`}
              style={!isLandscape ? { maxHeight: '60vh', objectFit: 'contain' } : undefined}
            />
          </div>

          {/* ── Infos ── */}
          <div
            className={`overflow-y-auto ${
              isLandscape ? 'md:w-80 shrink-0' : ''
            } p-6 flex flex-col gap-4`}
          >
            {/* Catégorie + titre */}
            <div>
              <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium mb-2">
                {artwork.category}
              </span>
              <h2 className="text-xl font-bold text-gray-900">{artwork.title}</h2>
              {artwork.year && (
                <p className="text-sm text-gray-400 mt-1">{artwork.year}</p>
              )}
            </div>

            {/* Description */}
            {artwork.description && (
              <p className="text-gray-600 text-sm leading-relaxed">{artwork.description}</p>
            )}

            {/* Stats */}
            <div className="flex gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4 text-red-400" /> {artwork.likes}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4 text-blue-400" /> {artwork.views}
              </span>
            </div>

            {/* Outils */}
            {artwork.tools?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Outils</p>
                <div className="flex flex-wrap gap-2">
                  {artwork.tools.map((t) => (
                    <span key={t} className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs">
                      <Tag className="w-3 h-3" /> {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-auto pt-4 border-t flex gap-2">
              <button
                onClick={() => onDelete(artwork.id)}
                disabled={deleting}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-medium hover:bg-red-100 transition disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

/* ── Page ──────────────────────────────────────────────────────────── */
export default function UserProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [artworks, setArtworks] = useState<MyArtwork[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<MyArtwork | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login')
  }, [status, router])

  useEffect(() => {
    if (status !== 'authenticated' || !session?.user?.id) return
    fetch(`/api/artworks?userId=${session.user.id}`)
      .then((r) => r.json())
      .then((data) => setArtworks(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [status, session?.user?.id])

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette œuvre ?')) return
    setDeleting(true)
    try {
      await fetch(`/api/artworks/${id}`, { method: 'DELETE' })
      setArtworks((prev) => prev.filter((a) => a.id !== id))
      setSelected(null)
    } finally {
      setDeleting(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
      </div>
    )
  }

  if (!session) return null

  const displayName =
    session.user?.name ||
    `${session.user?.firstName ?? ''} ${session.user?.lastName ?? ''}`.trim() ||
    session.user?.email?.split('@')[0] ||
    'Artiste'

  return (
    <div className="min-h-screen bg-gray-50 lg:pl-20 xl:pl-24">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8 pt-20 lg:pt-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-8 mb-8 text-white"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <UserAvatar name={displayName} src={session.user?.image} size={96} className="border-4 border-white/30" />
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-3xl font-bold mb-1">{displayName}</h1>
              <p className="text-white/80 mb-4">{session.user?.email}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm">
                {[
                  { label: 'Œuvres', value: artworks.length },
                  { label: 'Likes', value: artworks.reduce((s, a) => s + a.likes, 0) },
                  { label: 'Vues', value: artworks.reduce((s, a) => s + a.views, 0).toLocaleString() },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white/20 rounded-lg px-4 py-2 text-center">
                    <span className="font-bold text-xl block">{value}</span>
                    <span className="text-white/80 text-xs">{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Link href="/upload" className="flex items-center gap-2 bg-white text-purple-700 px-4 py-2 rounded-full font-medium hover:bg-purple-50 transition text-sm">
                <Upload className="w-4 h-4" /> Publier
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full text-sm transition"
              >
                <LogOut className="w-4 h-4" /> Déconnexion
              </button>
            </div>
          </div>
        </motion.div>

        {/* Grille */}
        <h2 className="text-xl font-bold text-gray-900 mb-6">Mes œuvres</h2>

        {artworks.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl">
            <p className="text-gray-500 mb-4">Vous n'avez pas encore publié d'œuvre.</p>
            <Link href="/upload" className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-full font-medium hover:bg-purple-700 transition">
              <Upload className="w-4 h-4" /> Publier ma première œuvre
            </Link>
          </div>
        ) : (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
            {artworks.map((art, i) => (
              <motion.div
                key={art.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="break-inside-avoid cursor-pointer group relative rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow"
                onClick={() => setSelected(art)}
              >
                <img
                  src={art.image}
                  alt={art.title}
                  className="w-full h-auto block group-hover:scale-105 transition-transform duration-300"
                />
                {/* Overlay hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 flex flex-col justify-between p-3 opacity-0 group-hover:opacity-100">
                  <span className="self-start px-2 py-1 bg-white/90 rounded-full text-xs font-medium text-gray-700">
                    {art.category}
                  </span>
                  <p className="text-white font-semibold text-sm drop-shadow line-clamp-2">{art.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selected && (
        <ArtworkModal
          artwork={selected}
          onClose={() => setSelected(null)}
          onDelete={handleDelete}
          deleting={deleting}
        />
      )}
    </div>
  )
}
