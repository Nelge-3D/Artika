// app/data/services.ts
import data from '@/app/data/artistsdata.json'

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

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}