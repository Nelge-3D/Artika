'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

const images = [
  '/about1.png',
  '/about2.png',
  '/about3.png',
  '/about4.jpeg',
  '/about5.jpeg',
  '/about6.jpg',
  
]

export default function AboutSection() {
  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden px-4 md:px-12">
      {/* Titre et description */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
          Donner une voix à l’art africain
        </h2>
        <p className="text-lg text-gray-600">
          Artika est une plateforme dédiée à la mise en lumière des artistes visuels africains.
          Notre mission est de briser les barrières, célébrer la créativité et connecter les talents du continent avec le monde.
        </p>
      </div>

      {/* Grille artistique style puzzle */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
        {images.map((src, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            viewport={{ once: true }}
            className={`overflow-hidden rounded-xl shadow-md group relative ${i % 5 === 0 ? 'row-span-2' : ''}`}
          >
            <Image
              src={src}
              alt={`Œuvre ${i + 1}`}
              width={500}
              height={500}
              className="object-cover w-full h-full group-hover:scale-105 transition duration-500 ease-in-out"
            />
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition duration-300" />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
