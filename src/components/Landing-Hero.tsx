'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const images = [
  '/hero1.png',
  '/hero2.png',
  '/hero3.png',
  '/hero4.png',
  '/hero5.png',
  '/hero6.png',
]

export default function Hero() {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => (prev + 1) % images.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const displayedImages = useMemo(() => {
    return images.concat(images) // Duplication pour fluidité défilement
  }, [])

  return (
    <section className="relative h-screen bg-gradient-to-r from-blue-950 via-red-900 to-purple-900 overflow-hidden flex items-center justify-center px-4">
      
      {/* Effets décoratifs */}
      <div className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-blue-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-purple-900 to-transparent z-10 pointer-events-none" />
      
      {/* Blob SVG décoratif */}
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-gradient-to-tr from-blue-300 to-purple-300 rounded-full opacity-20 blur-3xl animate-pulse z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-gradient-to-tr from-yellow-200 to-pink-300 rounded-full opacity-20 blur-3xl animate-pulse z-0" />

      {/* Colonne gauche animée */}
      <div className="absolute left-6 top-0 h-full flex flex-col gap-4 animate-gallery-up z-10">
        {displayedImages.map((src, i) => (
          <Image
            key={`left-${i}`}
            src={displayedImages[(i + offset) % images.length]}
            alt={`Œuvre ${i + 1}`}
            width={128}
            height={192}
            className="w-24 h-36 md:w-28 md:h-44 object-cover rounded-lg shadow-lg hover:scale-105 hover:rotate-[2deg] transition duration-700"
          />
        ))}
      </div>

      {/* Colonne droite animée inversée */}
      <div className="absolute right-6 bottom-0 h-full flex flex-col-reverse gap-4 animate-gallery-down z-10">
        {displayedImages.map((src, i) => (
          <Image
            key={`right-${i}`}
            src={displayedImages[(i + offset) % images.length]}
            alt={`Œuvre ${i + 1}`}
            width={128}
            height={192}
            className="w-24 h-36 md:w-28 md:h-44 object-cover rounded-lg shadow-lg hover:scale-105 hover:-rotate-[2deg] transition duration-700"
          />
        ))}
      </div>

      {/* Texte central avec animations avancées */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 50, delay: 0.3 }}
        className="relative z-20 text-center max-w-2xl"
      >
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.04,
              },
            },
          }}
          className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r via-white mb-6 drop-shadow"
        >
          {"L'art numérique sous toutes ses facettes".split('').map((char, i) => (
            <motion.span
              key={i}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              {char}
            </motion.span>
          ))}
        </motion.h1>

        <p className="text-base md:text-lg text-white mb-6">
          Découvrez les talents visuels du continent avec <span className="text-blue-600 font-semibold">Artika</span>.
        </p>

        <a
          href="/feed"
          className="inline-flex items-center gap-2 border-1 bg-gradient-to-l from-purple-800 via-purple-700 text-white px-6 py-3 rounded-full shadow-lg  hover:to-purple-600 transition"
        >
          Rejoindre la communauté <ArrowRight size={18} />
        </a>
      </motion.div>
    </section>
  )
}
