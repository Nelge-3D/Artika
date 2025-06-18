'use client'

import Masonry from 'react-masonry-css'
import ArtCard from '@/components/ui/ArtCard'
import { useState } from 'react'
import ArtModal from '@/components/ui/ArtModal'
import GalleryHeader from '@/components/ui/GalleryHeader'

const artworks = [
  { id:'1', image: '/parfum.png', title: 'Eau de parfum', artist: 'Louis-Gériel', tools: ['Canva', 'Blender'] },
  { id:'2', image: '/hero2.png', title: 'Esprit du désert', artist: 'Fatou Diop', tools: ['Photoshop', 'Blender'] },
  { id:'3', image: '/hero3.png', title: 'Fusion', artist: 'Mamadou Sagna', tools: ['Photoshop', 'Blender'] },
  { id:'4', image: '/hero4.png', title: 'Identité', artist: 'Ayo Kale', tools: ['Photoshop', 'Blender'] },
  { id:'5', image: '/hero5.png', title: 'Dakar Dreams', artist: 'Binta Kane', tools: ['Photoshop', 'Blender'] },
  { id:'6', image: '/hero1.png', title: 'Beauté Noire', artist: 'Kofi Mensah', tools: ['Photoshop', 'Blender'] },
  { id:'7', image: '/hero2.png', title: 'Esprit du désert', artist: 'Fatou Diop', tools: ['Photoshop', 'Blender'] },
  { id:'8', image: '/hero3.png', title: 'Fusion', artist: 'Mamadou Sagna', tools: ['Photoshop', 'Blender'] },
  { id:'9', image: '/hero4.png', title: 'Identité', artist: 'Ayo Kale' , tools: ['Photoshop', 'Blender']},
  { id:'10', image: '/hero5.png', title: 'Dakar Dreams', artist: 'Binta Kane', tools: ['Photoshop', 'Blender'] },
  { id:'11', image: '/hero1.png', title: 'Beauté Noire', artist: 'Kofi Mensah', tools: ['Photoshop', 'Blender'] },
  { id:'12', image: '/hero2.png', title: 'Esprit du désert', artist: 'Fatou Diop', tools: ['Photoshop', 'Blender'] },
  { id:'13', image: '/hero3.png', title: 'Fusion', artist: 'Mamadou Sagna' , tools: ['Photoshop', 'Blender']},
  { id:'14', image: '/hero4.png', title: 'Identité', artist: 'Ayo Kale' , tools: ['Photoshop', 'Blender']},
  { id:'15', image: '/hero5.png', title: 'Dakar Dreams', artist: 'Binta Kane' , tools: ['Photoshop', 'Blender']},
]

// Configuration responsive pour Masonry
const breakpointColumnsObj = {
  default: 4,      // 4 colonnes sur grand écran
  1200: 3,         // 3 colonnes sur écran moyen-large
  900: 2,          // 2 colonnes sur tablette
  640: 1,          // 1 colonne sur mobile
}

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState<'artists' | 'artworks'>('artworks')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedArtwork, setSelectedArtwork] = useState<null | typeof artworks[0]>(null)

  const handleCardClick = (art: any) => {
    setSelectedArtwork(art)
  }

  const closeModal = () => {
    setSelectedArtwork(null)
  }

  const getSimilarArtworks = (artwork: any) => {
    return artworks.filter(a => a.artist === artwork.artist && a.id !== artwork.id)
  }

  // Filtrer les œuvres selon la recherche
  const filteredArtworks = artworks.filter(art => 
    art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    art.artist.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <main className="bg-white min-h-screen">
      <GalleryHeader 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Galerie responsive */}
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {filteredArtworks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Aucune œuvre trouvée pour "{searchQuery}"</p>
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