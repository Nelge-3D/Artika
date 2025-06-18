// app/artist/[slug]/page.tsx

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import Navbar from '@/components/ui/Navbar'
import { Heart, MessageCircle, Share2, MapPin, Calendar, Eye, Users, Download, Filter, Search, Star, Camera, Palette, Code, User } from 'lucide-react'

const artworks = [
  { 
    id: '1', 
    image: '/parfum.png', 
    title: 'Eau de parfum', 
    artist: 'Louis-Gériel', 
    tools: ['Canva', 'Blender'], 
    popularity: 77,
    category: 'Branding',
    year: 2024,
    likes: 156,
    views: 2340,
    description: 'Création d\'une identité visuelle moderne pour une marque de parfum haut de gamme.',
    images: ['/parfum.png', '/parfum-2.png', '/parfum-3.png']
  },
  { 
    id: '2', 
    image: '/hero2.png', 
    title: 'Esprit du désert', 
    artist: 'Fatou Diop', 
    tools: ['Procreate', 'Lightroom'], 
    popularity: 77,
    category: 'Illustration',
    year: 2024,
    likes: 203,
    views: 3200,
    description: 'Série d\'illustrations inspirées des paysages du Sahel.',
    images: ['/hero2.png']
  },
  { 
    id: '3', 
    image: '/hero3.png', 
    title: 'Fusion', 
    artist: 'Mamadou Sagna', 
    tools: ['Illustrator'], 
    popularity: 85,
    category: 'Graphisme',
    year: 2023,
    likes: 312,
    views: 4560,
    description: 'Exploration des formes géométriques africaines contemporaines.',
    images: ['/hero3.png']
  },
  { 
    id: '4', 
    image: '/hero4.png', 
    title: 'Identité', 
    artist: 'Ayo Kale', 
    tools: ['Figma'], 
    popularity: 64,
    category: 'UI/UX',
    year: 2024,
    likes: 89,
    views: 1870,
    description: 'Interface utilisateur pour une application de découverte culturelle.',
    images: ['/hero4.png']
  },
  { 
    id: '5', 
    image: '/hero5.png', 
    title: 'Dakar Dreams', 
    artist: 'Binta Kane', 
    tools: ['Blender'], 
    popularity: 93,
    category: '3D',
    year: 2024,
    likes: 445,
    views: 6780,
    description: 'Visualisation 3D futuriste de la capitale sénégalaise.',
    images: ['/hero5.png']
  },
]

const artistsData = {
  'louis-geriel': {
    name: 'Louis-Gériel',
    bio: 'Designer graphique passionné par l\'intersection entre tradition africaine et modernité numérique. Spécialisé dans l\'identité visuelle et le branding culturel.',
    location: 'Dakar, Sénégal',
    joinDate: 'Janvier 2023',
    followers: 1247,
    following: 342,
    totalViews: 12450,
    totalLikes: 890,
    available: true,
    skills: ['Branding', 'Identité visuelle', 'Packaging', 'Direction artistique'],
    experience: '5+ ans d\'expérience',
    education: 'École Supérieure d\'Art de Dakar',
    website: 'louisgeriel.com',
    instagram: '@louisgeriel_design',
    behance: 'louisgeriel'
  },
  'fatou-diop': {
    name: 'Fatou Diop',
    bio: 'Illustratrice et artiste numérique explorant les récits africains contemporains à travers des œuvres vibrantes et expressives.',
    location: 'Abidjan, Côte d\'Ivoire',
    joinDate: 'Mars 2022',
    followers: 2156,
    following: 178,
    totalViews: 18900,
    totalLikes: 1456,
    available: true,
    skills: ['Illustration', 'Art numérique', 'Storytelling', 'Character design'],
    experience: '7+ ans d\'expérience',
    education: 'Beaux-Arts de Abidjan',
    website: 'fatoudiop.art',
    instagram: '@fatou_illustrations',
    behance: 'fatoudiop'
  }
}

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

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const artist = artworks.find(a => slugify(a.artist) === params.slug)?.artist || 'Artiste'
  return {
    title: `${artist} - Portfolio créatif`,
    description: `Découvrez le portfolio de ${artist}, artiste visuel africain spécialisé dans l'art numérique contemporain.`
  }
}

export default function ArtistPage({ params }: { params: { slug: string } }) {
  const slug = params.slug
  const artistArtworks = artworks.filter(art => slugify(art.artist) === slug)

  if (artistArtworks.length === 0) return notFound()

  const artistName = artistArtworks[0].artist
  const artistData = artistsData[slug as keyof typeof artistsData] || {
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
    behance: ''
  }
  
  const artistIcon = `/avatars/${slug}.png`
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
                  <Image
                    src={artistIcon}
                    alt={artistName}
                    width={120}
                    height={120}
                    className="rounded-full border-4 border-white shadow-xl object-cover w-30 h-30"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-white"></div>
                </div>
                
                <div className="text-center sm:text-left">
                  <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">{artistData.name}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-white/90 mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{artistData.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Membre depuis {artistData.joinDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{popularity}% popularité</span>
                    </div>
                  </div>
                  
                  {/* Statistiques */}
                  <div className="flex flex-wrap gap-6 text-white/90 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{artistArtworks.length}</div>
                      <div className="text-sm">Projets</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{artistData.followers.toLocaleString()}</div>
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
                    <div className={`w-3 h-3 rounded-full ${artistData.available ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <span className="text-white/90 text-sm">
                      {artistData.available ? 'Disponible pour de nouveaux projets' : 'Occupé actuellement'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-full font-medium hover:bg-gray-100 transition shadow-lg">
                  <User className="w-4 h-4" />
                  Suivre
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition shadow-lg">
                  <MessageCircle className="w-4 h-4" />
                  Contacter
                </button>
                <button className="flex items-center gap-2 px-4 py-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition">
                  <Share2 className="w-4 h-4" />
                </button>
                <button className="flex items-center gap-2 px-4 py-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2">
            {/* Navigation des sections */}
            <div className="bg-white rounded-xl shadow-sm mb-6 sticky top-4 z-10">
              <div className="flex items-center gap-6 px-6 py-4 border-b">
                <button className="text-purple-600 font-medium border-b-2 border-purple-600 pb-2">
                  Projets ({artistArtworks.length})
                </button>
                <button className="text-gray-600 hover:text-gray-900 transition pb-2">
                  Collections
                </button>
                <button className="text-gray-600 hover:text-gray-900 transition pb-2">
                  Témoignages
                </button>
              </div>
              
              {/* Filtres et recherche */}
              <div className="flex flex-wrap items-center gap-4 px-6 py-4">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Rechercher dans les projets..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500">
                    <option>Toutes catégories</option>
                    {categories.map(cat => (
                      <option key={cat}>{cat}</option>
                    ))}
                  </select>
                  <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500">
                    <option>Plus récents</option>
                    <option>Plus populaires</option>
                    <option>Plus de vues</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Grille des projets */}
            <div className="grid gap-6 sm:grid-cols-2">
              {artistArtworks.map((art) => (
                <div
                  key={art.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
                >
                  <div className="relative w-full h-64">
                    <Image
                      src={art.image}
                      alt={art.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 bg-white/90 rounded-full hover:bg-white transition">
                          <Heart className="w-4 h-4 text-gray-700" />
                        </button>
                        <button className="p-2 bg-white/90 rounded-full hover:bg-white transition">
                          <Share2 className="w-4 h-4 text-gray-700" />
                        </button>
                      </div>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="px-2 py-1 bg-white/90 rounded-full text-xs font-medium text-gray-700">
                        {art.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                      {art.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{art.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>Outils: {art.tools.join(', ')}</span>
                      <span>{art.year}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span>{art.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{art.views}</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        {art.popularity}% popularité
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* À propos */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">À propos</h3>
              <p className="text-gray-700 leading-relaxed mb-4">{artistData.bio}</p>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{artistData.experience}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{artistData.education}</span>
                </div>
              </div>
            </div>

            {/* Compétences */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Compétences</h3>
              <div className="flex flex-wrap gap-2">
                {artistData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Liens */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Liens</h3>
              <div className="space-y-3">
                {artistData.website && (
                  <a href={`https://${artistData.website}`} className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition">
                    <div className="w-4 h-4 bg-purple-100 rounded"></div>
                    <span className="text-sm">{artistData.website}</span>
                  </a>
                )}
                {artistData.instagram && (
                  <a href={`https://instagram.com/${artistData.instagram.replace('@', '')}`} className="flex items-center gap-2 text-pink-600 hover:text-pink-700 transition">
                    <Camera className="w-4 h-4" />
                    <span className="text-sm">{artistData.instagram}</span>
                  </a>
                )}
                {artistData.behance && (
                  <a href={`https://behance.net/${artistData.behance}`} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition">
                    <Palette className="w-4 h-4" />
                    <span className="text-sm">Behance</span>
                  </a>
                )}
              </div>
            </div>

            {/* Artistes recommandés */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Artistes similaires</h3>
              <div className="space-y-3">
                {artworks.filter(art => art.artist !== artistName).slice(0, 3).map((art) => (
                  <Link 
                    key={art.id}
                    href={`/artist/${slugify(art.artist)}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition"
                  >
                    <Image
                      src={`/avatars/${slugify(art.artist)}.png`}
                      alt={art.artist}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{art.artist}</div>
                      <div className="text-xs text-gray-500">{art.tools[0]}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Retour */}
        <div className="text-center mt-12">
          <Link 
            href="/feed" 
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition"
          >
            ← Retour à la galerie
          </Link>
        </div>
      </div>
    </main>
  )
}