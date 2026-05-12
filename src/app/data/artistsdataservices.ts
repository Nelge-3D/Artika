import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/slugify'

export interface ArtistArtwork {
  id: string
  image: string
  title: string
  artist: string
  tools: string[]
  category: string
  likes: number
  views: number
  popularity: number
  description?: string
  year: number
  images: string[]
}

export interface ArtistProfile {
  name: string
  bio: string
  location: string
  joinDate: string
  followers: number
  following: number
  totalViews: number
  totalLikes: number
  available: boolean
  skills: string[]
  experience: string
  education: string
  website: string
  instagram: string
  behance: string
  image?: string | null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapArtwork(art: any): ArtistArtwork {
  const user = art.user
  return {
    id: art.id,
    image: art.imageUrl,
    title: art.title,
    artist: user.name || `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
    tools: art.tools,
    category: art.category,
    likes: art.likes,
    views: art.views,
    popularity: art.popularity,
    description: art.description ?? undefined,
    year: art.year,
    images: [art.imageUrl],
  }
}

export async function getArtworks(): Promise<ArtistArtwork[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const artworks = await (prisma as any).artwork.findMany({
    include: { user: { select: { id: true, name: true, firstName: true, lastName: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return artworks.map(mapArtwork)
}

export async function getArtistBySlug(slug: string): Promise<ArtistProfile | null> {
  const users = await prisma.user.findMany({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    select: { id: true, name: true, firstName: true, lastName: true, image: true, createdAt: true } as any,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = (users as any[]).find((u) => {
    const displayName = u.name || `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim()
    return slugify(displayName) === slug
  })
  if (!user) return null

  const displayName = user.name || `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const interests: string[] = Array.isArray((user as any).interests) ? (user as any).interests : []

  return {
    name: displayName,
    image: user.image ?? null,
    bio: `${displayName} est un artiste visuel partageant ses créations sur ArTika.`,
    location: 'Gabon',
    joinDate: new Date(user.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
    followers: 0,
    following: 0,
    totalViews: 0,
    totalLikes: 0,
    available: true,
    skills: interests.length > 0 ? interests : ['Art numérique'],
    experience: 'Artiste',
    education: 'Autodidacte',
    website: '',
    instagram: '',
    behance: '',
  }
}

export async function getArtworksByArtist(slug: string): Promise<ArtistArtwork[]> {
  const artworks = await getArtworks()
  return artworks.filter((art) => slugify(art.artist) === slug)
}
