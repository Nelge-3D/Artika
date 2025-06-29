'use client'

import { useCallback, memo, useState } from 'react'
import { SearchIcon } from '@/components/icons'

interface GalleryHeaderProps {
  activeTab: 'artists' | 'artworks'
  setActiveTab: (tab: 'artists' | 'artworks') => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  activeCategory: string | null
  setActiveCategory: (category: string | null) => void
}

const CATEGORIES = ["Photographie", "3D", "2D", "Infographie", "Sculpture"] as const

// Configuration des artistes en vedette
const FEATURED_ARTISTS: FeaturedArtist[] = [
  {
    id: 'nelge-3d',
    name: 'NELGE-3D',
    displayName: 'NELGE-3D',
    backgroundImage: '/vedette/Nelge-3D.svg'
  },
  {
    id: 'marie-dance',
    name: 'MARie',
    displayName: 'Marie',
    backgroundImage: '/vedette/Artika.svg'
  },
  {
    id: 'kev-digital',
    name: 'Kev Graphix', 
    displayName: 'Kev Graphix',
    backgroundImage: '/vedette/Kev.svg'
  },
  {
    id: 'sophie-sculpt',
    name: 'Neyc Photography',
    displayName: 'Neyc', 
    backgroundImage: '/vedette/Neyc.svg'
  }
]

const GalleryHeader = memo(function GalleryHeader({ 
  activeTab, 
  setActiveTab, 
  searchQuery, 
  setSearchQuery,
  activeCategory,
  setActiveCategory
}: GalleryHeaderProps) {
  // État pour l'artiste en vedette actuel
  const [featuredArtistIndex, setFeaturedArtistIndex] = useState(0)
  const currentArtist = FEATURED_ARTISTS[featuredArtistIndex]

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }, [setSearchQuery])

  const handleTabChange = useCallback((tab: 'artists' | 'artworks') => {
    setActiveTab(tab)
  }, [setActiveTab])

  // Fonction pour changer d'artiste en vedette
  const handleFeaturedArtistChange = useCallback(() => {
    setFeaturedArtistIndex((prev) => (prev + 1) % FEATURED_ARTISTS.length)
  }, [])

  return (
    <>
      <header className="relative h-auto min-h-[400px] md:h-[500px] lg:h-[600px] w-full">
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-red-800 to-purple-800 overflow-hidden">
          <div 
            className="absolute inset-0 opacity-50 bg-center bg-cover transition-all duration-700 ease-in-out"
            style={{ backgroundImage: `url('${currentArtist.backgroundImage}')` }}
            aria-hidden="true"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center py-8">
          <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-0 sm:absolute sm:top-6">
            <div className="relative w-full sm:max-w-md order-2 sm:order-1">
              <label htmlFor="art-search" className="sr-only">Rechercher une œuvre ou un artiste</label>
              <input
                id="art-search"
                type="search"
                placeholder="Rechercher une œuvre ou un artiste"
                className="w-full pl-4 pr-10 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full focus:outline-none focus:ring-2 focus:ring-white border border-white/30 placeholder:text-white/70 text-sm sm:text-base transition-colors duration-200"
                value={searchQuery}
                onChange={handleSearchChange}
                aria-label="Recherche dans la galerie"
              />
              <button 
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                aria-label="Lancer la recherche"
                tabIndex={0}
              >
                <SearchIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </button>
            </div>

            <div className="flex items-center gap-3 sm:gap-6 order-1 sm:order-2 self-end sm:self-auto">
              <div className="text-right">
                <p className="text-white font-medium text-sm sm:text-base">ORLINE ENGLISH</p>
                <p className="text-white text-xs sm:text-sm">5 minutes</p>
              </div>
              <div 
                className="w-8 h-8 sm:w-10 sm:mr-8 sm:h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 cursor-pointer hover:bg-white/30 transition-colors"
                role="button"
                aria-label="Profil utilisateur"
                tabIndex={0}
              >
                <span className="font-bold text-white text-sm sm:text-base">OE</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6 md:gap-8 lg:gap-10">
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-[40px] lg:text-5xl font-bold text-white mb-8 lg:mb-8">
                Galerie des œuvres
              </h1>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center sm:justify-start">
                <TabButton 
                  active={activeTab === 'artists'}
                  onClick={() => handleTabChange('artists')}
                  label="Artistes"
                />
                <TabButton 
                  active={activeTab === 'artworks'}
                  onClick={() => handleTabChange('artworks')}
                  label="Œuvres"
                />
              </div>
            </div>

            <FeaturedBadge 
              artist={currentArtist}
              onArtistChange={handleFeaturedArtistChange}
              currentIndex={featuredArtistIndex}
              totalArtists={FEATURED_ARTISTS.length}
            />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 -mt-8 sm:-mt-10 z-10 relative">
        <div className="bg-white rounded-xl shadow-lg p-2 sm:p-3">
          <nav aria-label="Filtres de catégories">
            <div className="flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar snap-x justify-start sm:justify-start">
              <button
                className={`snap-start px-3 sm:px-5 py-2 sm:py-3 rounded-full font-medium transition-colors text-sm sm:text-base focus:ring-2 focus:ring-purple-500 focus:outline-none whitespace-nowrap ${
                  activeCategory === null 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => setActiveCategory(null)}
              >
                Toutes
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`snap-start px-3 sm:px-5 py-2 sm:py-3 rounded-full font-medium transition-colors text-sm sm:text-base focus:ring-2 focus:ring-purple-500 focus:outline-none whitespace-nowrap ${
                    cat === activeCategory 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </>
  )
})

// Sous-composants :

interface TabButtonProps {
  active: boolean
  onClick: () => void
  label: string
}

const TabButton = memo(function TabButton({ active, onClick, label }: TabButtonProps) {
  return (
    <button 
      className={`w-full sm:w-auto px-6 py-2 rounded-full text-base lg:text-lg font-medium transition-all ${
        active 
          ? 'bg-white text-purple-900 shadow-lg hover:shadow-xl' 
          : 'bg-transparent text-white border border-white hover:bg-white/10'
      }`}
      onClick={onClick}
      aria-pressed={active}
    >
      {label}
    </button>
  )
})

// Type pour un artiste en vedette
type FeaturedArtist = {
  id: string
  name: string
  displayName: string
  backgroundImage: string
}

interface FeaturedBadgeProps {
  artist: FeaturedArtist
  onArtistChange: () => void
  currentIndex: number
  totalArtists: number
}

const FeaturedBadge = memo(function FeaturedBadge({ 
  artist, 
  onArtistChange, 
  currentIndex, 
  totalArtists 
}: FeaturedBadgeProps) {
  return (
    <div className="text-center sm:text-left lg:text-right">
      <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl inline-block hover:bg-white/30 transition-colors">
        <div className="flex items-center justify-between gap-3 mb-2">
          <p className="text-white font-bold text-lg lg:text-xl">En vedette</p>
          <button
            onClick={onArtistChange}
            className="text-white hover:text-gray-200 transition-colors text-xs bg-white/20 px-2 py-1 rounded-full"
            aria-label="Changer d'artiste en vedette"
          >
            {currentIndex + 1}/{totalArtists}
          </button>
        </div>
        <p className="text-white text-xs lg:text-sm font-medium mb-2">
          {artist.displayName}
        </p>
        <button
          onClick={onArtistChange}
          className="text-white/80 hover:text-white text-xs transition-colors underline"
          aria-label={`Passer à l'artiste suivant`}
        >
          Suivant →
        </button>
      </div>
    </div>
  )
})

export default GalleryHeader