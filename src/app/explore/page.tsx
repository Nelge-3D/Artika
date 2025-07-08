'use client'

import Masonry from 'react-masonry-css'
import ArtCard from '@/components/ui/ArtCard'
import ArtistCard from '@/components/ui/ArtistCard'
import { useState, useEffect } from 'react'
import ArtModal from '@/components/ui/ArtModal'
import { FiFilter, FiSearch, FiX } from 'react-icons/fi'
import { 
  getArtworks, 
  getArtists, 
  getCategories,
  getArtworkById,
  type Artwork, 
  type Artist 
} from '@/app/data/dataservices'

const breakpointColumnsObj = {
  default: 4,
  1200: 3,
  900: 2,
  640: 1,
}

const artistsBreakpointCols = {
  default: 3,
  1024: 2,
  640: 1,
}

// Types de filtres disponibles
type FilterType = 'category' | 'artist' | 'tool' | 'location'

interface FilterOption {
  type: FilterType
  value: string
  label: string
}

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null)
  const [activeFilters, setActiveFilters] = useState<FilterOption[]>([])
  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [artists, setArtists] = useState<Artist[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artworksData, artistsData, categoriesData] = await Promise.all([
          getArtworks(),
          getArtists(),
          getCategories()
        ])
        setArtworks(artworksData)
        setArtists(artistsData)
        setCategories(categoriesData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Options de filtrage
  const categoryOptions = categories
  const artistOptions = Array.from(new Set(artworks.map(art => art.artist)))
  const toolOptions = Array.from(new Set(artworks.flatMap(art => art.tools)))
  const locationOptions = Array.from(new Set(artists.map(artist => artist.location)))

  const handleCardClick = async (art: Artwork) => {
    const fullArtwork = await getArtworkById(art.id)
    if (fullArtwork) {
      setSelectedArtwork(fullArtwork)
    }
  }

  const closeModal = () => {
    setSelectedArtwork(null)
  }

  const getSimilarArtworks = (artwork: Artwork) => {
    return artworks.filter(a => a.artist === artwork.artist && a.id !== artwork.id)
  }

  const toggleFilter = (type: FilterType, value: string, label: string) => {
    setActiveFilters(prev => {
      const existingIndex = prev.findIndex(f => f.type === type && f.value === value)
      if (existingIndex >= 0) {
        return prev.filter((_, index) => index !== existingIndex)
      } else {
        return [...prev, { type, value, label }]
      }
    })
  }

  const clearFilters = () => {
    setActiveFilters([])
  }

  // Filtrer les œuvres en fonction des filtres actifs et de la recherche
  const filteredArtworks = artworks.filter(art => {
    // Filtre par recherche
    const matchesSearch = 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.description?.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Filtre par filtres actifs
    const matchesFilters = activeFilters.every(filter => {
      switch (filter.type) {
        case 'category':
          return art.category === filter.value
        case 'artist':
          return art.artist === filter.value
        case 'tool':
          return art.tools.includes(filter.value)
        default:
          return true
      }
    })
    
    return matchesSearch && matchesFilters
  })

  // Filtrer les artistes en fonction des filtres actifs et de la recherche
  const filteredArtists = artists.filter(artist => {
    // Filtre par recherche
    const matchesSearch = 
      artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.speciality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.location.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Filtre par filtres actifs
    const matchesFilters = activeFilters.every(filter => {
      switch (filter.type) {
        case 'location':
          return artist.location === filter.value
        case 'artist':
          return artist.name === filter.value
        default:
          return true
      }
    })
    
    return matchesSearch && matchesFilters
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <main className="bg-white min-h-screen">
      {/* En-tête d'exploration */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Explorez l'Art Africain Contemporain</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Découvrez des œuvres uniques et des artistes talentueux à travers le continent
          </p>
          
          {/* Barre de recherche et filtres */}
          <div className="max-w-2xl mx-auto relative">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Rechercher des œuvres, artistes..."
                className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                className="ml-3 p-3 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 flex items-center"
              >
                <FiFilter className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Panneau de filtres (mobile/desktop) */}
      {showFilterPanel && (
        <div className="bg-white shadow-lg rounded-lg mx-4 sm:mx-6 lg:mx-8 p-4 -mt-4 z-10 relative">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-900">Filtres</h3>
            <button onClick={() => setShowFilterPanel(false)} className="text-gray-500 hover:text-gray-700">
              <FiX size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Filtre par catégorie */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Catégories</h4>
              <div className="space-y-2">
                {categoryOptions.map(category => (
                  <label key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={activeFilters.some(f => f.type === 'category' && f.value === category)}
                      onChange={() => toggleFilter('category', category, category)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Filtre par artiste */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Artistes</h4>
              <div className="space-y-2">
                {artistOptions.slice(0, 5).map(artist => (
                  <label key={artist} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={activeFilters.some(f => f.type === 'artist' && f.value === artist)}
                      onChange={() => toggleFilter('artist', artist, artist)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{artist}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Filtre par outil */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Outils</h4>
              <div className="space-y-2">
                {toolOptions.map(tool => (
                  <label key={tool} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={activeFilters.some(f => f.type === 'tool' && f.value === tool)}
                      onChange={() => toggleFilter('tool', tool, tool)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{tool}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Filtre par localisation */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Localisations</h4>
              <div className="space-y-2">
                {locationOptions.map(location => (
                  <label key={location} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={activeFilters.some(f => f.type === 'location' && f.value === location)}
                      onChange={() => toggleFilter('location', location, location)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{location}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          {activeFilters.length > 0 && (
            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {activeFilters.length} filtre{activeFilters.length > 1 ? 's' : ''} actif{activeFilters.length > 1 ? 's' : ''}
              </span>
              <button 
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Tout effacer
              </button>
            </div>
          )}
        </div>
      )}

      {/* Filtres actifs */}
      {activeFilters.length > 0 && (
        <div className="container mx-auto px-4 pt-6">
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter, index) => (
              <span 
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {filter.label}
                <button 
                  onClick={() => toggleFilter(filter.type, filter.value, filter.label)}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500"
                >
                  <FiX size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-8">
        {/* Sections suggérées */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Collections populaires</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Collection 1 */}
            <div className="relative rounded-xl overflow-hidden h-48 bg-gradient-to-r from-purple-500 to-blue-500">
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="text-center p-4">
                  <h3 className="text-white text-xl font-bold mb-2">Art 3D Africain</h3>
                  <p className="text-white text-sm">
                    {artworks.filter(a => a.category === '3D').length} œuvres
                  </p>
                </div>
              </div>
            </div>
            
            {/* Collection 2 */}
            <div className="relative rounded-xl overflow-hidden h-48 bg-gradient-to-r from-amber-500 to-orange-500">
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="text-center p-4">
                  <h3 className="text-white text-xl font-bold mb-2">Portraits Modernes</h3>
                  <p className="text-white text-sm">
                    {artworks.filter(a => a.category === 'Photographie').length} œuvres
                  </p>
                </div>
              </div>
            </div>
            
            {/* Collection 3 */}
            <div className="relative rounded-xl overflow-hidden h-48 bg-gradient-to-r from-emerald-500 to-teal-500">
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="text-center p-4">
                  <h3 className="text-white text-xl font-bold mb-2">Artistes Émergents</h3>
                  <p className="text-white text-sm">
                    {artists.filter(a => a.followers && a.followers < 2000).length} artistes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Œuvres récentes */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Œuvres à découvrir</h2>
          {filteredArtworks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Aucune œuvre ne correspond à vos critères</p>
              <button 
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Réinitialiser les filtres
              </button>
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

        {/* Artistes à suivre */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Artistes à suivre</h2>
          {filteredArtists.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Aucun artiste ne correspond à vos critères</p>
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
                    //followers={artist.followers}
                  />
                </div>
              ))}
            </Masonry>
          )}
        </div>
      </div>
      
      {/* Modal d'œuvre */}
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