'use client'

import Image from 'next/image'
import { useState } from 'react'

const COLORS = [
  'bg-purple-500', 'bg-blue-500', 'bg-indigo-500',
  'bg-pink-500', 'bg-green-500', 'bg-orange-500', 'bg-red-500',
]

function getColor(name: string) {
  return COLORS[name.charCodeAt(0) % COLORS.length]
}

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
}

interface UserAvatarProps {
  name: string
  src?: string | null
  size?: number
  className?: string
}

export default function UserAvatar({ name, src, size = 40, className = '' }: UserAvatarProps) {
  const [imgError, setImgError] = useState(false)

  if (src && !imgError) {
    return (
      <Image
        src={src}
        alt={name}
        width={size}
        height={size}
        className={`rounded-full object-cover ${className}`}
        onError={() => setImgError(true)}
      />
    )
  }

  return (
    <div
      className={`${getColor(name)} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 ${className}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.35) }}
    >
      {getInitials(name)}
    </div>
  )
}
