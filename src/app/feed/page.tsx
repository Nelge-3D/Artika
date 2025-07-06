'use client'

import Masonry from 'react-masonry-css'
import ArtCard from '@/components/ui/ArtCard'
import ArtistCard from '@/components/ui/ArtistCard'
import { useState, useEffect } from 'react'
import ArtModal from '@/components/ui/ArtModal'
import GalleryHeader from '@/components/ui/GalleryHeader'
import { 
  getArtworks, 
  getArtists, 
  getCategories, 
  searchArtworks, 
  getArtworksByCategory,
  type Artwork, 
  type Artist 
} from '@/app/data/dataservices'

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

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState<'artists' | 'artworks'>('artworks')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  
  // États pour les données
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [artists, setArtists] = useState<Artist[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [filteredArtworks, setFilteredArtworks] = useState<Artwork[]>([])
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Chargement initial des données
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true)
        const [artworksData, artistsData, categoriesData] = await Promise.all([
          getArtworks(),
          getArtists(),
          getCategories()
        ])
        
        setArtworks(artworksData)
        setArtists(artistsData)
        setCategories(categoriesData)
        setFilteredArtworks(artworksData)
        setFilteredArtists(artistsData)
      } catch (err) {
        setError('Erreur lors du chargement des données')
        console.error('Error loading data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [])

  // Filtrage des œuvres d'art
  useEffect(() => {
    const filterArtworks = async () => {
      try {
        let result: Artwork[] = []
        
        if (searchQuery.trim()) {
          // Si on a une recherche, utiliser la fonction de recherche
          result = await searchArtworks(searchQuery)
          
          // Appliquer le filtre de catégorie si nécessaire
          if (activeCategory) {
            result = result.filter(art => art.category === activeCategory)
          }
        } else if (activeCategory) {
          // Si on a seulement une catégorie, utiliser le filtre par catégorie
          result = await getArtworksByCategory(activeCategory)
        } else {
          // Sinon, afficher toutes les œuvres
          result = artworks
        }
        
        setFilteredArtworks(result)
      } catch (err) {
        console.error('Error filtering artworks:', err)
        setFilteredArtworks([])
      }
    }

    if (artworks.length > 0) {
      filterArtworks()
    }
  }, [searchQuery, activeCategory, artworks])

  // Filtrage des artistes
  useEffect(() => {
    const filterArtists = () => {
      if (!searchQuery.trim()) {
        setFilteredArtists(artists)
        return
      }

      const query = searchQuery.toLowerCase()
      const result = artists.filter(artist => 
        artist.name.toLowerCase().includes(query) ||
        artist.speciality.toLowerCase().includes(query) ||
        artist.location.toLowerCase().includes(query)
      )
      
      setFilteredArtists(result)
    }

    filterArtists()
  }, [searchQuery, artists])

  const handleCardClick = (art: Artwork) => {
    setSelectedArtwork(art)
  }

  const closeModal = () => {
    setSelectedArtwork(null)
  }

  const getSimilarArtworks = (artwork: Artwork) => {
    return artworks.filter(a => a.artist === artwork.artist && a.id !== artwork.id)
  }

  // Affichage du loading
  if (loading) {
    return (
      <main className="bg-white min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </main>
    )
  }

  // Affichage de l'erreur
  if (error) {
    return (
      <main className="bg-white min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Réessayer
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-white min-h-screen">
      <GalleryHeader 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        categories={categories}
      />

      {/* Contenu conditionnel selon l'onglet actif */}
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {activeTab === 'artworks' ? (
          // Vue des œuvres
          <>
            {filteredArtworks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  {searchQuery.trim() || activeCategory 
                    ? `Aucune œuvre trouvée ${searchQuery.trim() ? `pour "${searchQuery}"` : ''}${activeCategory ? ` dans la catégorie "${activeCategory}"` : ''}`
                    : 'Aucune œuvre disponible'
                  }
                </p>
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
                <p className="text-gray-500 text-lg">
                  {searchQuery.trim() 
                    ? `Aucun artiste trouvé pour "${searchQuery}"`
                    : 'Aucun artiste disponible'
                  }
                </p>
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