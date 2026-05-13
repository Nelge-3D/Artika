'use client'

import { Heart, Share2, Bookmark } from 'lucide-react'
import { useState } from 'react'

interface ArtCardProps {
  image: string
  title: string
  artist: string
  onClick?: () => void
}

export default function ArtCard({ image, title, artist, onClick }: ArtCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  return (
    <div
      className="group relative bg-white rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-shadow duration-300"
      onClick={onClick}
    >
      {/* Action buttons */}
      <div className="absolute top-3 right-3 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
        <button
          onClick={(e) => { e.stopPropagation(); setIsBookmarked(!isBookmarked) }}
          className="p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Bookmark
            size={15}
            className={`transition-colors duration-200 ${isBookmarked ? 'text-blue-600 fill-blue-600' : 'text-gray-600'}`}
          />
        </button>
        <button
          onClick={(e) => e.stopPropagation()}
          className="p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Share2 size={15} className="text-gray-600" />
        </button>
      </div>

      {/* Image — proportions naturelles comme Pinterest */}
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={title}
          loading="lazy"
          decoding="async"
          className="w-full h-auto block transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient + infos au hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <h3 className="text-sm font-bold mb-0.5 drop-shadow-lg line-clamp-1">{title}</h3>
          <p className="text-xs opacity-90 drop-shadow mb-2">par {artist}</p>
          <button
            onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked) }}
            className="flex items-center gap-1.5"
          >
            <Heart
              size={15}
              className={`transition-all duration-300 ${isLiked ? 'text-red-400 fill-red-400' : 'text-white/80 hover:text-red-400'}`}
            />
            <span className={`text-xs font-medium ${isLiked ? 'text-red-400' : 'text-white/80'}`}>
              {isLiked ? 'Aimé' : "J'aime"}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
