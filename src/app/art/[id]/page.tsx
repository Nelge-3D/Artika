import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import Navbar from '@/components/ui/Navbar'
import UserAvatar from '@/components/ui/UserAvatar'
import { Heart, Eye, Tag, ArrowLeft, ExternalLink } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/slugify'

async function getArtwork(id: string) {
  return prisma.artwork.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, name: true, firstName: true, lastName: true, image: true },
      },
    },
  })
}

async function getSimilar(category: string, excludeId: string) {
  return prisma.artwork.findMany({
    where: { category, id: { not: excludeId } },
    take: 4,
    orderBy: { popularity: 'desc' },
    include: {
      user: { select: { name: true, firstName: true, lastName: true } },
    },
  })
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const artwork = await getArtwork(id)
  if (!artwork) return { title: 'Œuvre introuvable — ArTika' }

  const artistName =
    artwork.user.name ||
    `${artwork.user.firstName ?? ''} ${artwork.user.lastName ?? ''}`.trim()

  return {
    title: `${artwork.title} — ArTika`,
    description:
      artwork.description ||
      `Découvrez "${artwork.title}" par ${artistName} sur ArTika, la galerie d'art numérique gabonaise.`,
    openGraph: {
      title: artwork.title,
      description: artwork.description || `Une œuvre de ${artistName}`,
      images: [{ url: artwork.imageUrl, width: 1200, height: 630, alt: artwork.title }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: artwork.title,
      description: artwork.description || `Une œuvre de ${artistName}`,
      images: [artwork.imageUrl],
    },
  }
}

export default async function ArtworkPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [artwork, similarRaw] = await Promise.all([getArtwork(id), getSimilar('', id)])

  if (!artwork) return notFound()

  const similar = await getSimilar(artwork.category, id)

  const artistName =
    artwork.user.name ||
    `${artwork.user.firstName ?? ''} ${artwork.user.lastName ?? ''}`.trim()
  const artistSlug = slugify(artistName)

  return (
    <main className="min-h-screen bg-gray-50 lg:pl-20 xl:pl-24">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8 pt-20 lg:pt-8">
        {/* Retour */}
        <Link
          href="/feed"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-purple-600 transition mb-6 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la galerie
        </Link>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image */}
            <div className="relative bg-gray-900 min-h-[400px] md:min-h-[600px]">
              <Image
                src={artwork.imageUrl}
                alt={artwork.title}
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Infos */}
            <div className="p-8 flex flex-col gap-6 overflow-y-auto max-h-[600px]">
              {/* Artiste */}
              <Link
                href={`/artist/${artistSlug}`}
                className="flex items-center gap-3 group w-fit"
              >
                <UserAvatar name={artistName} src={artwork.user.image} size={48} />
                <div>
                  <p className="font-semibold text-gray-900 group-hover:text-purple-600 transition">
                    {artistName}
                  </p>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    Voir le profil <ExternalLink className="w-3 h-3" />
                  </p>
                </div>
              </Link>

              {/* Titre + meta */}
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    {artwork.category}
                  </span>
                  {artwork.year && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                      {artwork.year}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-gray-900 leading-tight">{artwork.title}</h1>
              </div>

              {/* Description */}
              {artwork.description && (
                <p className="text-gray-600 text-sm leading-relaxed">{artwork.description}</p>
              )}

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-red-400" />
                  {artwork.likes} like{artwork.likes !== 1 ? 's' : ''}
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-blue-400" />
                  {artwork.views.toLocaleString()} vue{artwork.views !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Outils */}
              {artwork.tools.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Outils</p>
                  <div className="flex flex-wrap gap-2">
                    {artwork.tools.map((tool) => (
                      <span
                        key={tool}
                        className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium border border-purple-100"
                      >
                        <Tag className="w-3 h-3" /> {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Lien profil artiste */}
              <div className="mt-auto">
                <Link
                  href={`/artist/${artistSlug}`}
                  className="inline-flex items-center gap-2 w-full justify-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition"
                >
                  Voir toutes les œuvres de {artistName}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Œuvres similaires */}
        {similar.length > 0 && (
          <section className="mt-12">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              Autres œuvres en <span className="text-purple-600">{artwork.category}</span>
            </h2>
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
              {similar.map((art) => {
                const name =
                  art.user.name ||
                  `${art.user.firstName ?? ''} ${art.user.lastName ?? ''}`.trim()
                return (
                  <Link
                    key={art.id}
                    href={`/art/${art.id}`}
                    className="break-inside-avoid block group rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-auto block group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="p-3">
                      <p className="text-sm font-medium text-gray-800 line-clamp-1">{art.title}</p>
                      <p className="text-xs text-gray-500">{name}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
