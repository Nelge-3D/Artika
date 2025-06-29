'use client'

import Masonry from 'react-masonry-css'
import ArtCard from '@/components/ui/ArtCard'
import ArtistCard from '@/components/ui/ArtistCard'
import { useState } from 'react'
import ArtModal from '@/components/ui/ArtModal'
import GalleryHeader from '@/components/ui/GalleryHeader'



// Define types for artwork and artist
interface Artwork {
  id: string
  image: string
  title: string
  artist: string
  tools: string[]
  category: string
}

interface Artist {
  id: string
  name: string
  avatar: string
  artworkCount: number
  speciality: string
  location: string
}

// Mettez à jour vos données d'œuvres avec les catégories
const artworks: Artwork[] = [
  { id:'1', image: '/parfum.png', title: 'Eau de parfum', artist: 'Louis-Gériel', tools: ['Canva', 'Blender'], category: '3D' },
  { id:'2', image: '/hero2.png', title: 'Esprit du désert', artist: 'Fatou Diop', tools: ['Photoshop', 'Blender'], category: 'Photographie' },
  { id:'3', image: '/hero3.png', title: 'Fusion', artist: 'Mamadou Sagna', tools: ['Photoshop', 'Blender'], category: '3D' },
  { id:'4', image: '/hero4.png', title: 'Identité', artist: 'Ayo Kale', tools: ['Photoshop', 'Blender'], category: '2D' },
  { id:'5', image: '/hero5.png', title: 'Dakar Dreams', artist: 'Binta Kane', tools: ['Photoshop', 'Blender'], category: 'Infographie' },
  { id:'6', image: '/hero1.png', title: 'Beauté Noire', artist: 'Kofi Mensah', tools: ['Photoshop', 'Blender'], category: 'Photographie' },
  { id:'7', image: '/hero2.png', title: 'Esprit du désert', artist: 'Fatou Diop', tools: ['Photoshop', 'Blender'], category: 'Photographie' },
  { id:'8', image: '/hero3.png', title: 'Fusion', artist: 'Mamadou Sagna', tools: ['Photoshop', 'Blender'], category: '3D' },
  { id:'9', image: '/hero4.png', title: 'Identité', artist: 'Ayo Kale' , tools: ['Photoshop', 'Blender'], category: '2D' },
  { id:'10', image: '/hero5.png', title: 'Dakar Dreams', artist: 'Binta Kane', tools: ['Photoshop', 'Blender'], category: 'Infographie' },
  { id:'11', image: '/hero1.png', title: 'Beauté Noire', artist: 'Kofi Mensah', tools: ['Photoshop', 'Blender'], category: 'Photographie' },
  { id:'12', image: '/hero2.png', title: 'Esprit du désert', artist: 'Fatou Diop', tools: ['Photoshop', 'Blender'], category: 'Photographie' },
  { id:'13', image: '/hero3.png', title: 'Fusion', artist: 'Mamadou Sagna' , tools: ['Photoshop', 'Blender'], category: '3D' },
  { id:'14', image: '/hero4.png', title: 'Identité', artist: 'Ayo Kale' , tools: ['Photoshop', 'Blender'], category: '2D' },
  { id:'15', image: '/hero5.png', title: 'Dakar Dreams', artist: 'Binta Kane' , tools: ['Photoshop', 'Blender'], category: 'Sculpture' },
]

// Données des artistes (générées à partir des œuvres)
const artists: Artist[] = [
  { 
    id: '1', 
    name: 'Louis-Gériel', 
    avatar: '/vedette/Nelge-3D.svg', 
    artworkCount: artworks.filter(art => art.artist === 'Louis-Gériel').length,
    speciality: 'Design graphique',
    location: 'Owendo,Gabon'
  },
  { 
    id: '2', 
    name: 'Fatou Diop', 
    avatar: '/vedette/Artika.svg', 
    artworkCount: artworks.filter(art => art.artist === 'Fatou Diop').length,
    speciality: 'Art digital',
    location: 'Saint-Louis, Sénégal'
  },
  { 
    id: '3', 
    name: 'Mamadou Sagna', 
    avatar: '/vedette/Kev.svg', 
    artworkCount: artworks.filter(art => art.artist === 'Mamadou Sagna').length,
    speciality: 'Infographie 3D',
    location: 'Owendo, Gabon'
  },
  { 
    id: '4', 
    name: 'Ayo Kale', 
    avatar: '/vedette/Neyc.svg', 
    artworkCount: artworks.filter(art => art.artist === 'Ayo Kale').length,
    speciality: 'Photomontage',
    location: 'France, Paris'
  },
  { 
    id: '5', 
    name: 'Binta Kane', 
    avatar: '/hero5.png', 
    artworkCount: artworks.filter(art => art.artist === 'Binta Kane').length,
    speciality: 'Art conceptuel',
    location: 'Bamako, Mali'
  },
  { 
    id: '6', 
    name: 'Kofi Mensah', 
    avatar: '/hero1.png', 
    artworkCount: artworks.filter(art => art.artist === 'Kofi Mensah').length,
    speciality: 'Portrait artistique',
    location: 'Accra, Ghana'
  },
]

// Configuration responsive pour Masonry
const breakpointColumnsObj = {
  default: 4,      // 4 colonnes sur grand écran
  1200: 3,         // 3 colonnes sur écran moyen-large
  900: 2,          // 2 colonnes sur tablette
  640: 1,          // 1 colonne sur mobile
}

// Configuration pour la grille des artistes
const artistsBreakpointCols = {
  default: 3,      // 3 colonnes sur grand écran
  1024: 2,         // 2 colonnes sur écran moyen
  640: 1,          // 1 colonne sur mobile
}

// Dans le composant FeedPage, ajoutez l'état pour la catégorie active
export default function FeedPage() {
  const [activeTab, setActiveTab] = useState<'artists' | 'artworks'>('artworks')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const handleCardClick = (art: Artwork) => {
    setSelectedArtwork(art)
  }

  const closeModal = () => {
    setSelectedArtwork(null)
  }

  const getSimilarArtworks = (artwork: Artwork) => {
    return artworks.filter(a => a.artist === artwork.artist && a.id !== artwork.id)
  }

  // Modifiez le filtrage des œuvres pour inclure la catégorie
  const filteredArtworks = artworks.filter(art => 
    (art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     art.artist.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (activeCategory ? art.category === activeCategory : true)
  )

  // Filtrer les artistes selon la recherche
  const filteredArtists = artists.filter(artist => 
    artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    artist.speciality.toLowerCase().includes(searchQuery.toLowerCase()) ||
    artist.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <main className="bg-white min-h-screen">
      <GalleryHeader 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      {/* Contenu conditionnel selon l'onglet actif */}
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {activeTab === 'artworks' ? (
          // Vue des œuvres
          <>
            {filteredArtworks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Aucune œuvre trouvée pour &quot;{searchQuery}&quot;</p>
              </div>
            ) : (
              <Masonry
                breakpointCols={breakpointColumnsObj}
                className="flex -ml-3 sm:-ml-4 lg:-ml-6"
                columnClassName="pl-3 sm:pl-4 lg:pl-6"
              >
                {filteredArtworks.map((art) => (
                  <div key={art.id} className="mb-4 sm:mb-6">
                    <ArtCard
                      image={art.image}
                      title={art.title}
                      artist={art.artist}
                      onClick={() => handleCardClick(art)}
                    />
                  </div>
                ))}
              </Masonry>
            )}
          </>
        ) : (
          // Vue des artistes
          <>
            {filteredArtists.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Aucun artiste trouvé pour &quot;{searchQuery}&quot;</p>
              </div>
            ) : (
              <Masonry
                breakpointCols={artistsBreakpointCols}
                className="flex -ml-3 sm:-ml-4 lg:-ml-6"
                columnClassName="pl-3 sm:pl-4 lg:pl-6"
              >
                {filteredArtists.map((artist) => (
                  <div key={artist.id} className="mb-6">
                    <ArtistCard
                      name={artist.name}
                      avatar={artist.avatar}
                      artworkCount={artist.artworkCount}
                      speciality={artist.speciality}
                      location={artist.location}
                    />
                  </div>
                ))}
              </Masonry>
            )}
          </>
        )}
      </div>
      
      {selectedArtwork && (
        <ArtModal
          artwork={selectedArtwork}
          similarArtworks={getSimilarArtworks(selectedArtwork)}
          onClose={closeModal}
        />
      )}
    </main>
  )
}