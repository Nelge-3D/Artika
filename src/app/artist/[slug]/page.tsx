// app/artist/[slug]/page.tsx

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'

const artworks = [
  { id: '1', image: '/parfum.png', title: 'Eau de parfum', artist: 'Louis', tools: ['Canva', 'Blender'], popularity: 77 },
  { id: '2', image: '/hero2.png', title: 'Esprit du désert', artist: 'Fatou Diop', tools: ['Procreate', 'Lightroom'], popularity: 77 },
  { id: '3', image: '/hero3.png', title: 'Fusion', artist: 'Mamadou Sagna', tools: ['Illustrator'], popularity: 85 },
  { id: '4', image: '/hero4.png', title: 'Identité', artist: 'Ayo Kale', tools: ['Figma'], popularity: 64 },
  { id: '5', image: '/hero5.png', title: 'Dakar Dreams', artist: 'Binta Kane', tools: ['Blender'], popularity: 93 },
]

function slugify(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-')
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const artist = artworks.find(a => slugify(a.artist) === params.slug)?.artist || 'Artiste'
  return {
    title: `${artist} - Profil de l'artiste`
  }
}

export default function ArtistPage({ params }: { params: { slug: string } }) {
  const slug = params.slug
  const artistArtworks = artworks.filter(art => slugify(art.artist) === slug)

  if (artistArtworks.length === 0) return notFound()

  const artistName = artistArtworks[0].artist
  const artistIcon = `/avatars/${slug}.png`
  const popularity = Math.round(
    artistArtworks.reduce((acc, art) => acc + art.popularity, 0) / artistArtworks.length
  )

  return (
    <main className="container mx-auto px-4 py-10">
      {/* Profil de l'artiste */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-12">
        <Image
          src={artistIcon}
          alt={artistName}
          width={100}
          height={100}
          className="rounded-full border-4 border-white shadow-lg object-cover w-28 h-28"
        />
        <div>
          <h1 className="text-4xl font-bold text-gray-900">{artistName}</h1>
          <p className="text-gray-600 mt-1">Popularité : <span className="font-medium">{popularity}%</span></p>
          <button className="mt-3 px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow hover:scale-105 transition">
            Prendre rendez-vous
          </button>
        </div>
      </div>

      {/* Infos */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3 text-gray-800">À propos</h2>
        <p className="text-gray-700 leading-relaxed">
          {artistName} est un artiste visuel basé en Afrique de l'Ouest, explorant les liens entre tradition et modernité
          à travers des œuvres numériques. Son travail allie des outils contemporains comme Blender ou Procreate avec une
          esthétique inspirée des récits africains.
        </p>
      </section>

      {/* Albums */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Albums</h2>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {artistArtworks.map((art) => (
            <div
              key={art.id}
              className="bg-white border rounded-xl shadow hover:shadow-xl transition overflow-hidden group"
            >
              <div className="relative w-full h-56">
                <Image
                  src={art.image}
                  alt={art.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold">{art.title}</h3>
                <p className="text-sm text-gray-500 mt-1">Outils : {art.tools.join(', ')}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="text-center">
        <Link href="/feed" className="text-blue-600 hover:underline font-medium">
          ← Retour à la galerie
        </Link>
      </div>
    </main>
  )
}
