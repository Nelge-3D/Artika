'use client'

import Image from 'next/image'
import { Heart, Share2, Bookmark } from 'lucide-react'
import { useState } from 'react'

interface ArtCardProps {
  image: string
  title: string
  artist: string
  onClick?: () => void // Ajout ici
}

export default function ArtCard({ image, title, artist, onClick }: ArtCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  return (
    <div
      className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer"
      onClick={onClick} // Gestion du clic
    >
      {/* Action buttons overlay */}
      <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsBookmarked(!isBookmarked)
          }}
          className="p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Bookmark
            size={16}
            className={`transition-colors duration-200 ${
              isBookmarked ? 'text-blue-600 fill-blue-600' : 'text-gray-600'
            }`}
          />
        </button>
        <button
          onClick={(e) => e.stopPropagation()}
          className="p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Share2 size={16} className="text-gray-600" />
        </button>
      </div>

      {/* Image container - Full card height */}
      <div className="relative w-full aspect-[4/5] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient overlay at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Content overlay - positioned at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <h3 className="text-xl font-bold mb-1 drop-shadow-lg">
            {title}
          </h3>
          <p className="text-sm opacity-90 mb-3 drop-shadow">
            par {artist}
          </p>

          {/* Tags */}
          <div className="flex gap-2 mb-4">
            <span className="px-3 py-1 text-xs font-medium bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
              #art
            </span>
            <span className="px-3 py-1 text-xs font-medium bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
              #3D
            </span>
          </div>

          {/* Like button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsLiked(!isLiked)
            }}
            className="flex items-center gap-2 transition-all duration-200"
          >
            <Heart
              size={18}
              className={`transition-all duration-300 ${
                isLiked
                  ? 'text-red-400 fill-red-400'
                  : 'text-white/80 hover:text-red-400'
              }`}
            />
            <span
              className={`text-sm font-medium transition-colors duration-200 ${
                isLiked ? 'text-red-400' : 'text-white/80'
              }`}
            >
              {isLiked ? 'Aimé' : "J'aime"}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
