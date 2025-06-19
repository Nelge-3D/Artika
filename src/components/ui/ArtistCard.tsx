'use client'

import { memo } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface ArtistCardProps {
  name: string
  avatar: string
  artworkCount: number
  speciality: string
  location: string
  onClick?: () => void
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

const ArtistCard = memo(function ArtistCard({ 
  name, 
  avatar, 
  artworkCount, 
  speciality, 
  location, 
  onClick 
}: ArtistCardProps) {
  const artistSlug = slugify(name)
  
  return (
    <Link href={`/artist/${artistSlug}`} className="block">
      <div 
        className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden border border-gray-100"
        onClick={onClick}
      >
      {/* Avatar section */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={avatar}
          alt={`Avatar de ${name}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        
        {/* Badge du nombre d'œuvres */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
          <span className="text-xs font-semibold text-gray-800">
            {artworkCount} œuvre{artworkCount > 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Informations de l'artiste */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
          {name}
        </h3>
        
        <p className="text-purple-600 font-medium text-sm mb-2">
          {speciality}
        </p>
        
        <div className="flex items-center text-gray-500">
          <svg 
            className="w-4 h-4 mr-1" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" 
              clipRule="evenodd" 
            />
          </svg>
          <span className="text-xs">{location}</span>
        </div>
      </div>

      {/* Effet de hover */}
      <div className="absolute inset-0 bg-purple-600/0 group-hover:bg-purple-600/5 transition-colors duration-300 pointer-events-none" />
    </div>
    </Link>
  )
})

export default ArtistCard