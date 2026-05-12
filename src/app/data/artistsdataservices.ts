// app/data/services.ts
import data from '@/app/data/artistsdata.json'
import { slugify } from '@/lib/slugify'

export function getArtworks() {
  return data.artworks
}

export function getArtists() {
  return data.artists
}

export function getArtistBySlug(slug: string) {
  return data.artists[slug as keyof typeof data.artists]
}

export function getArtworksByArtist(artistName: string) {
  return data.artworks.filter(art => slugify(art.artist) === artistName)
}