// services/dataService.ts
import data from '@/app/data/data.json';

export interface Artwork {
  id: string;
  image: string;
  title: string;
  artist: string;
  tools: string[];
  category: string;
  price?: number;
  likes?: number;
  description?: string;
}

export interface Artist {
  id: string;
  name: string;
  avatar: string;
  artworkCount: number;
  speciality: string;
  location: string;
  followers?: number;
  bio?: string;
}

export interface Exhibition {
  id: string;
  title: string;
  date: string;
  location: string;
  featuredArtworks: string[];
}

// Simule un délai de chargement comme une vraie API
const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 300));

export const getArtworks = async (): Promise<Artwork[]> => {
  await simulateDelay();
  return data.artworks;
};

export const getArtworkById = async (id: string): Promise<Artwork | undefined> => {
  await simulateDelay();
  return data.artworks.find(art => art.id === id);
};

export const getArtists = async (): Promise<Artist[]> => {
  await simulateDelay();
  return data.artists;
};

export const getArtistById = async (id: string): Promise<Artist | undefined> => {
  await simulateDelay();
  return data.artists.find(artist => artist.id === id);
};

export const getCategories = async (): Promise<string[]> => {
  await simulateDelay();
  return data.categories;
};

export const getExhibitions = async (): Promise<Exhibition[]> => {
  await simulateDelay();
  return data.exhibitions;
};

// Fonctions de filtrage
export const getArtworksByCategory = async (category: string): Promise<Artwork[]> => {
  await simulateDelay();
  return data.artworks.filter(art => art.category === category);
};

export const searchArtworks = async (query: string): Promise<Artwork[]> => {
  await simulateDelay();
  const q = query.toLowerCase();
  return data.artworks.filter(art => 
    art.title.toLowerCase().includes(q) || 
    art.artist.toLowerCase().includes(q) ||
    art.description?.toLowerCase().includes(q)
  );
};