export interface Artwork {
  id: string
  image: string
  title: string
  artist: string
  artistId?: string
  artistImage?: string | null
  tools: string[]
  category: string
  likes?: number
  views?: number
  popularity?: number
  description?: string
  year?: number
}

export interface Artist {
  id: string
  name: string
  avatar: string
  artworkCount: number
  speciality: string
  location: string
  followers?: number
  bio?: string
}

async function fetchArtworks(params?: Record<string, string>): Promise<Artwork[]> {
  const query = params ? '?' + new URLSearchParams(params).toString() : ''
  const res = await fetch(`/api/artworks${query}`, { cache: 'no-store' })
  if (!res.ok) return []
  return res.json()
}

export const getArtworks = (): Promise<Artwork[]> => fetchArtworks()

export const getArtworkById = async (id: string): Promise<Artwork | undefined> => {
  const all = await fetchArtworks()
  return all.find((a) => a.id === id)
}

export const getArtworksByCategory = (category: string): Promise<Artwork[]> =>
  fetchArtworks({ category })

export const searchArtworks = (query: string): Promise<Artwork[]> =>
  fetchArtworks({ search: query })

export const getArtists = async (): Promise<Artist[]> => {
  const artworks = await fetchArtworks()
  const byArtist = new Map<string, { artworks: Artwork[]; id: string }>()

  for (const art of artworks) {
    const key = art.artist
    if (!byArtist.has(key)) {
      byArtist.set(key, { artworks: [], id: art.artistId || art.artist })
    }
    byArtist.get(key)!.artworks.push(art)
  }

  return Array.from(byArtist.entries()).map(([name, { artworks: arts, id }]) => ({
    id,
    name,
    avatar: arts[0]?.image || '/avatars/default.png',
    artworkCount: arts.length,
    speciality: arts[0]?.category || 'Art numérique',
    location: 'Gabon',
  }))
}

export const getCategories = async (): Promise<string[]> => {
  const artworks = await fetchArtworks()
  return [...new Set(artworks.map((a) => a.category))]
}

export interface FeaturedArtist {
  id: string
  name: string
  image?: string | null
  bio?: string | null
}

export const getFeaturedArtists = async (): Promise<FeaturedArtist[]> => {
  try {
    const res = await fetch('/api/featured-artists', { cache: 'no-store' })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export const getUserInterests = async (): Promise<string[]> => {
  try {
    const res = await fetch('/api/user/interests', { cache: 'no-store' })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data.interests) ? data.interests : []
  } catch {
    return []
  }
}
