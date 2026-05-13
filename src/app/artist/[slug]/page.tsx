// app/artist/[slug]/page.tsx

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'
import Navbar from '@/components/ui/Navbar'
import { Heart, MapPin, Calendar, Eye, Camera, Globe, ArrowLeft } from 'lucide-react'
import { getArtworks, getArtistBySlug, getArtworksByArtist } from '@/app/data/artistsdataservices'
import { slugify } from '@/lib/slugify'
import UserAvatar from '@/components/ui/UserAvatar'

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params
  const artworks = await getArtworks()
  const artist = artworks.find(a => slugify(a.artist) === slug)?.artist || 'Artiste'
  return {
    title: `${artist} - Portfolio créatif`,
    description: `Découvrez le portfolio de ${artist}, artiste visuel africain spécialisé dans l'art numérique contemporain.`
  }
}

export default async function ArtistPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params
  
  // Récupération des données via les services
  const [artistArtworks, artistData, allArtworks] = await Promise.all([
    getArtworksByArtist(slug),
    getArtistBySlug(slug),
    getArtworks(),
  ])

  if (artistArtworks.length === 0) return notFound()

  const artistName = artistArtworks[0].artist
  
  // Données par défaut si l'artiste n'est pas trouvé dans la base
  const defaultArtistData = {
    name: artistName,
    bio: `${artistName} est un artiste visuel basé en Afrique de l'Ouest, explorant les liens entre tradition et modernité.`,
    location: 'Afrique de l\'Ouest',
    joinDate: 'Janvier 2024',
    followers: 0,
    following: 0,
    totalViews: 0,
    totalLikes: 0,
    available: true,
    skills: ['Art numérique'],
    experience: 'Artiste émergent',
    education: 'Autodidacte',
    website: '',
    instagram: '',
    behance: '',
    image: null
  }

  const finalArtistData = artistData || defaultArtistData
  
  const artistIcon = finalArtistData.image || null
  const popularity = Math.round(
    artistArtworks.reduce((acc, art) => acc + art.popularity, 0) / artistArtworks.length
  )

  const categories = [...new Set(artistArtworks.map(art => art.category))]
  const totalLikes = artistArtworks.reduce((acc, art) => acc + art.likes, 0)
  const totalViews = artistArtworks.reduce((acc, art) => acc + art.views, 0)

  return (
    <main className="bg-gray-50 min-h-screen">
      <Navbar/>
      
      <div className="container mx-auto px-4 py-8">
        {/* Header avec cover image */}
        <div className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 rounded-2xl mb-8 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative px-8 py-12">
            <div className="flex flex-col lg:flex-row items-start gap-8">
              {/* Avatar et infos principales */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 flex-1">
                <div className="relative">
                  <UserAvatar
                    name={artistName}
                    src={artistIcon}
                    size={120}
                    className="border-4 border-white shadow-xl"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-white"></div>
                </div>
                
                <div className="text-center sm:text-left">
                  <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">{finalArtistData.name}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-white/90 mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{finalArtistData.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Membre depuis {finalArtistData.joinDate}</span>
                    </div>
                  </div>
                  
                  {/* Statistiques */}
                  <div className="flex flex-wrap gap-6 text-white/90 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{artistArtworks.length}</div>
                      <div className="text-sm">Projets</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{finalArtistData.followers.toLocaleString()}</div>
                      <div className="text-sm">Abonnés</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{totalLikes}</div>
                      <div className="text-sm">Likes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
                      <div className="text-sm">Vues</div>
                    </div>
                  </div>

                  {/* Statut disponibilité */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`w-3 h-3 rounded-full ${finalArtistData.available ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <span className="text-white/90 text-sm">
                      {finalArtistData.available ? 'Disponible pour de nouveaux projets' : 'Occupé actuellement'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Retour */}
              <div>
                <Link
                  href="/feed"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full text-sm transition"
                >
                  <ArrowLeft className="w-4 h-4" /> Galerie
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Grille des œuvres */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Œuvres <span className="text-gray-400 font-normal text-sm">({artistArtworks.length})</span>
            </h2>
            <div className="columns-2 sm:columns-2 lg:columns-3 gap-3 space-y-3">
              {artistArtworks.map((art) => (
                <Link
                  key={art.id}
                  href={`/art/${art.id}`}
                  className="break-inside-avoid block group rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow"
                >
                  <img
                    src={art.image}
                    alt={art.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-auto block group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-3">
                    <p className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-purple-600 transition-colors">
                      {art.title}
                    </p>
                    <div className="flex items-center justify-between mt-1 text-xs text-gray-400">
                      <span>{art.category}</span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" /> {art.likes}
                        <Eye className="w-3 h-3 ml-2" /> {art.views}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* À propos */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-900">À propos</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{finalArtistData.bio}</p>
            </div>

            {/* Catégories */}
            {categories.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Catégories</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <span key={cat} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Liens */}
            {(finalArtistData.website || finalArtistData.instagram) && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Liens</h3>
                <div className="space-y-3">
                  {finalArtistData.website && (
                    <a
                      href={finalArtistData.website.startsWith('http') ? finalArtistData.website : `https://${finalArtistData.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition text-sm"
                    >
                      <Globe className="w-4 h-4" />
                      {finalArtistData.website}
                    </a>
                  )}
                  {finalArtistData.instagram && (
                    <a
                      href={`https://instagram.com/${finalArtistData.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-pink-600 hover:text-pink-700 transition text-sm"
                    >
                      <Camera className="w-4 h-4" />
                      @{finalArtistData.instagram.replace('@', '')}
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Artistes similaires */}
            {(() => {
              const seen = new Set<string>()
              const similar = allArtworks.filter((art) => {
                if (art.artist === artistName || seen.has(art.artist)) return false
                seen.add(art.artist)
                return true
              }).slice(0, 4)
              if (similar.length === 0) return null
              return (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Autres artistes</h3>
                  <div className="space-y-3">
                    {similar.map((art) => (
                      <Link
                        key={art.artist}
                        href={`/artist/${slugify(art.artist)}`}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition"
                      >
                        <UserAvatar name={art.artist} size={40} />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{art.artist}</p>
                          <p className="text-xs text-gray-500">{art.category}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
      </div>
    </main>
  )
}