'use client'

import Link from 'next/link'
import { useCallback, memo, useState } from 'react'
import { SearchIcon } from '@/components/icons'
import { slugify } from '@/lib/slugify'
import type { FeaturedArtist } from '@/app/data/dataservices'
import UserAvatar from '@/components/ui/UserAvatar'

export type { FeaturedArtist }

interface GalleryHeaderProps {
  activeTab: 'artists' | 'artworks'
  setActiveTab: (tab: 'artists' | 'artworks') => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  activeCategory: string | null
  setActiveCategory: (category: string | null) => void
  categories?: string[]
  featuredArtists?: FeaturedArtist[]
}

const FALLBACK_CATEGORIES = ['Photographie', '3D', '2D', 'Infographie', 'Sculpture']

const GalleryHeader = memo(function GalleryHeader({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  categories,
  featuredArtists = [],
}: GalleryHeaderProps) {
  const displayCategories = categories ?? FALLBACK_CATEGORIES
  const [featuredIndex, setFeaturedIndex] = useState(0)
  const currentArtist = featuredArtists[featuredIndex] ?? null

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }, [setSearchQuery])

  const handleTabChange = useCallback((tab: 'artists' | 'artworks') => {
    setActiveTab(tab)
  }, [setActiveTab])

  const handleNextArtist = useCallback(() => {
    if (featuredArtists.length === 0) return
    setFeaturedIndex((prev) => (prev + 1) % featuredArtists.length)
  }, [featuredArtists.length])

  return (
    <>
      <header className="relative h-auto min-h-[400px] md:h-[500px] lg:h-[600px] w-full">
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-red-800 to-purple-800 overflow-hidden">
          {currentArtist?.image && (
            <div
              className="absolute inset-0 opacity-50 bg-center bg-cover transition-all duration-700 ease-in-out"
              style={{ backgroundImage: `url('${currentArtist.image}')` }}
              aria-hidden="true"
            />
          )}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center py-8">
          {/* Barre de recherche */}
          <div className="w-full flex justify-start sm:absolute sm:top-6 mb-8 sm:mb-0">
            <div className="relative w-full sm:max-w-md">
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

            {currentArtist && (
              <FeaturedBadge
                artist={currentArtist}
                onNext={handleNextArtist}
                currentIndex={featuredIndex}
                total={featuredArtists.length}
              />
            )}
          </div>
        </div>
      </header>

      {/* Filtres catégories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 -mt-8 sm:-mt-10 z-10 relative">
        <div className="bg-white rounded-xl shadow-lg p-2 sm:p-3">
          <nav aria-label="Filtres de catégories">
            <div className="flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar snap-x justify-start">
              <button
                className={`snap-start px-3 sm:px-5 py-2 sm:py-3 rounded-full font-medium transition-colors text-sm sm:text-base focus:ring-2 focus:ring-purple-500 focus:outline-none whitespace-nowrap ${
                  activeCategory === null ? 'bg-purple-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => setActiveCategory(null)}
              >
                Toutes
              </button>
              {displayCategories.map((cat) => (
                <button
                  key={cat}
                  className={`snap-start px-3 sm:px-5 py-2 sm:py-3 rounded-full font-medium transition-colors text-sm sm:text-base focus:ring-2 focus:ring-purple-500 focus:outline-none whitespace-nowrap ${
                    cat === activeCategory ? 'bg-purple-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
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

// ── Sous-composants ───────────────────────────────────────────────────────────

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

interface FeaturedBadgeProps {
  artist: FeaturedArtist
  onNext: () => void
  currentIndex: number
  total: number
}

const FeaturedBadge = memo(function FeaturedBadge({ artist, onNext, currentIndex, total }: FeaturedBadgeProps) {
  return (
    <div className="text-center sm:text-left lg:text-right">
      <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl inline-block hover:bg-white/30 transition-colors">
        <div className="flex items-center justify-between gap-3 mb-2">
          <p className="text-white font-bold text-lg lg:text-xl">En vedette</p>
          {total > 1 && (
            <button
              onClick={onNext}
              className="text-white hover:text-gray-200 transition-colors text-xs bg-white/20 px-2 py-1 rounded-full"
              aria-label="Artiste suivant"
            >
              {currentIndex + 1}/{total}
            </button>
          )}
        </div>
        <Link
          href={`/artist/${slugify(artist.name)}`}
          className="flex items-center gap-3 group"
        >
          <UserAvatar name={artist.name} src={artist.image} size={48} className="ring-2 ring-white/50 flex-shrink-0" />
          <div>
            <p className="text-white font-medium text-sm lg:text-base mb-0.5 group-hover:underline">
              {artist.name}
            </p>
            {artist.bio && (
              <p className="text-white/70 text-xs line-clamp-2 max-w-[180px]">{artist.bio}</p>
            )}
            <span className="text-white/80 hover:text-white text-xs transition-colors mt-1 block">
              Voir le profil →
            </span>
          </div>
        </Link>
        {total > 1 && (
          <button
            onClick={onNext}
            className="text-white/70 hover:text-white text-xs transition-colors mt-2 underline"
          >
            Suivant →
          </button>
        )}
      </div>
    </div>
  )
})

export default GalleryHeader
