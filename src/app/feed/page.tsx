'use client'

import Masonry from 'react-masonry-css'
import ArtCard from '@/components/ui/ArtCard'
import { useState } from 'react'
import ArtModal from '@/components/ui/ArtModal'

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

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
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

  return (
    <main className="bg-white">
      {/* En-tête stylisé comme sur l'image */}
      <div className="relative h-70 w-full">
        {/* Fond de bannière */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-purple-800">
          <div className="absolute inset-0 bg-[url('/grid-pattern.jpg')] bg-[length:40px_40px] opacity-10"></div>
        </div>
        
        {/* Contenu de l'en-tête */}
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
          {/* Barre supérieure avec recherche et infos utilisateur */}
          <div className="absolute top-6 w-full flex justify-between items-center">
            {/* Barre de recherche */}
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Rechercher une œuvre ou un artiste"
                className="w-full pl-4 pr-10 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full focus:outline-none focus:ring-2 focus:ring-white border border-white/30 placeholder:text-white/70"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>

            {/* Infos utilisateur à droite */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-white font-medium">ORLINE ENGLISH</p>
                <p className="text-white text-sm">5 minutes</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                <span className="font-bold text-white">OE</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold text-white">Galerie des œuvres</h1>
              <div className="flex gap-4 mt-8">
                <button 
                  className={`px-6 py-2 rounded-full text-lg font-medium transition-all ${
                    activeTab === 'artists' 
                      ? 'bg-white text-purple-900 shadow-lg' 
                      : 'bg-transparent text-white border-2 border-white'
                  }`}
                  onClick={() => setActiveTab('artists')}
                >
                  Artistes
                </button>
                <button 
                  className={`px-6 py-2 rounded-full text-lg font-medium transition-all ${
                    activeTab === 'artworks' 
                      ? 'bg-white text-purple-900 shadow-lg' 
                      : 'bg-transparent text-white border-2 border-white'
                  }`}
                  onClick={() => setActiveTab('artworks')}
                >
                  Œuvres
                </button>
              </div>
            </div>
            
            <div className="text-right">
              <div className="mt-4 bg-white/20 backdrop-blur-sm p-3 rounded-xl inline-block">
                <p className="text-white font-bold text-xl">N° INVESTIBLE</p>
                <p className="text-white text-sm">NELLGE</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de filtres */}
      <div className="container mx-auto px-4 py-6 -mt-10 z-10 relative">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-wrap gap-3">
            {["Photographie", "3D", "2D", "Infographie", "Sculpture"].map((cat) => (
              <button
                key={cat}
                className="px-5 py-3 bg-gray-100 hover:bg-gray-200 rounded-full font-medium transition-colors"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Galerie */}
      <div className="container mx-auto px-4 py-8">
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex -ml-6"
          columnClassName="pl-6"
        >
          {artworks.map((art, i) => (
            <div key={i} className="mb-6">
              <ArtCard
                image={art.image}
                title={art.title}
                artist={art.artist}
                onClick={() => handleCardClick(art)}
              />
            </div>
          ))}
        </Masonry>
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