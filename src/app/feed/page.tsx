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
  getUserInterests,
  getFeaturedArtists,
  searchArtworks,
  getArtworksByCategory,
  type Artwork,
  type Artist,
  type FeaturedArtist,
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
  const [userClickedAll, setUserClickedAll] = useState(false)

  // États pour les données
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [artists, setArtists] = useState<Artist[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [userInterests, setUserInterests] = useState<string[]>([])
  const [featuredArtists, setFeaturedArtists] = useState<FeaturedArtist[]>([])
  const [filteredArtworks, setFilteredArtworks] = useState<Artwork[]>([])
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Chargement initial des données
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true)
        const [artworksData, artistsData, categoriesData, interestsData, featuredData] = await Promise.all([
          getArtworks(),
          getArtists(),
          getCategories(),
          getUserInterests(),
          getFeaturedArtists(),
        ])

        setArtworks(artworksData)
        setArtists(artistsData)
        setCategories(categoriesData)
        setUserInterests(interestsData)
        setFeaturedArtists(featuredData)

        // Affichage initial : filtrer par intérêts si l'utilisateur en a
        const initial =
          interestsData.length > 0
            ? artworksData.filter((a) => interestsData.includes(a.category))
            : artworksData
        setFilteredArtworks(initial)
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
          result = await searchArtworks(searchQuery)
          if (activeCategory) {
            result = result.filter((art) => art.category === activeCategory)
          }
        } else if (activeCategory) {
          result = await getArtworksByCategory(activeCategory)
        } else {
          // Pas de filtre actif : intérêts seulement si l'utilisateur n'a pas cliqué "Toutes"
          result =
            userInterests.length > 0 && !userClickedAll
              ? artworks.filter((a) => userInterests.includes(a.category))
              : artworks
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
  }, [searchQuery, activeCategory, artworks, userInterests, userClickedAll])

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
    <main className="bg-white min-h-screen lg:pl-16 xl:pl-20 pb-20 lg:pb-0">
      <GalleryHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeCategory={activeCategory}
        setActiveCategory={(cat) => {
            if (cat === null) setUserClickedAll(true)
            else setUserClickedAll(false)
            setActiveCategory(cat)
          }}
        categories={categories}
        featuredArtists={featuredArtists}
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
                    : userInterests.length > 0
                    ? `Aucune œuvre dans vos catégories d'intérêt (${userInterests.join(', ')})`
                    : 'Aucune œuvre disponible'}
                </p>
              </div>
            ) : (
              <Masonry
                breakpointCols={breakpointColumnsObj}
                className="flex -ml-3 sm:-ml-4 lg:-ml-6"
                columnClassName="pl-3 sm:pl-4 lg:pl-6"
              >
                {filteredArtworks.map((art) => (
                  <div key={art.id} className="mb-3 sm:mb-4">
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