'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

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

  const scrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    })
  }

  return (
    <section className="relative h-screen bg-gradient-to-r from-gray-800 via-black to-gray-800 overflow-hidden flex items-center justify-center px-4">
      
      {/* Effets décoratifs */}
      <div className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-gray-800 to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-gray-800 to-transparent z-10 pointer-events-none" />
      
      {/* Blob SVG décoratif */}
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-gradient-to-tr from-blue-800 to-purple-900 rounded-full opacity-20 blur-3xl animate-pulse z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-gradient-to-tr from-yellow-500 to-pink-900 rounded-full opacity-20 blur-3xl animate-pulse z-0" />

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
          className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-blue-900 to-purple-500 mb-6 drop-shadow"
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

        <p className="text-base md:text-lg text-white mb-8">
          Découvrez les talents visuels du continent avec <span className="text-blue-600 font-semibold">Artika</span>.
        </p>
      </motion.div>

      {/* Indicateur de scroll animé */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 cursor-pointer"
        onClick={scrollToNext}
      >
        <div className="flex flex-col items-center space-y-2 group">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="relative"
          >
            {/* Cercle pulsant */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full opacity-20 animate-ping" />
            
            {/* Bouton principal */}
            <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full p-3 shadow-lg group-hover:shadow-xl transition-all duration-300">
              <ChevronDown className="w-6 h-6 text-white" />
            </div>
          </motion.div>
          
          <motion.p 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="text-sm text-gray-600 font-medium"
          >
            Découvrir
          </motion.p>
        </div>
      </motion.div>

      {/* Ligne décorative qui guide l'œil vers le bas */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 40 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-px bg-gradient-to-b from-purple-600 to-transparent z-20"
      />
    </section>
  )
}