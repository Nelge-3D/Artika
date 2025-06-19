'use client'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Globe, Palette, Handshake, MapPin } from 'lucide-react'

const images = [
  '/about1.png',
  '/about2.png', 
  '/about3.png',
  '/about4.jpeg',
  '/about5.jpeg',
  '/about6.jpg',
]

const stats = [
  { number: "100+", label: "Artistes locaux" },
  { number: "500+", label: "Œuvres exposées" },
  { number: "50+", label: "Collaborations" }
]

export default function AboutSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden px-4 md:px-12">
      {/* Effet de fond décoratif */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-indigo-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-pink-500 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="relative z-10">
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <span className="inline-flex items-center px-6 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
            <Globe className="w-4 h-4 mr-2" />
            Plateforme 100% gabonaise
          </span>
        </motion.div>

        {/* Titre et description */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-800 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6 leading-tight">
            Donner une voix à l&apos;art africain
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed max-w-4xl mx-auto">
            <strong className="text-purple-600">ArTika</strong> est la première plateforme dédiée aux artistes visuels gabonais et africains. 
            Notre mission : <span className="font-semibold text-indigo-600">briser les barrières</span>, célébrer la créativité 
            et connecter les talents du continent avec le monde entier.
          </p>
          
          {/* Points clés */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100"
            >
              <div className="flex justify-center mb-3">
                <Palette className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Vitrine Professionnelle</h3>
              <p className="text-gray-600 text-sm">Une plateforme pour exposer vos créations avec des profils publics optimisés</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-indigo-100"
            >
              <div className="flex justify-center mb-3">
                <Handshake className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Collaboration Directe</h3>
              <p className="text-gray-600 text-sm">Contact direct via WhatsApp et réseaux sociaux pour faciliter les partenariats</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              viewport={{ once: true }}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-pink-100"
            >
              <div className="flex justify-center mb-3">
                <MapPin className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Rayonnement Africain</h3>
              <p className="text-gray-600 text-sm">De Libreville vers l&apos;Afrique : valoriser les talents du continent</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Statistiques */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex justify-center gap-8 md:gap-12 mb-16"
        >
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {stat.number}
              </div>
              <div className="text-gray-600 text-sm md:text-base">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Grille artistique améliorée - FIXED */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto"
        >
          {images.map((src, i) => (
            <Link href="/feed" key={i}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotateY: 15 }}
                whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ 
                  duration: 0.7, 
                  delay: i * 0.15,
                  type: "spring",
                  stiffness: 100 
                }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: -5,
                  transition: { duration: 0.3 }
                }}
                className={`
                  overflow-hidden rounded-2xl shadow-xl group relative cursor-pointer
                  ${i % 5 === 0 ? 'md:row-span-2' : ''}
                  ${i === 1 ? 'md:col-span-2' : ''}
                  hover:shadow-2xl transition-all duration-500
                  bg-gradient-to-br from-white to-gray-50
                  block
                `}
              >
                <div className="relative overflow-hidden rounded-2xl">
                  <Image
                    src={src}
                    alt={`Œuvre d'art africain ${i + 1}`}
                    width={500}
                    height={500}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  
                  {/* Overlay avec effet glassmorphism */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Badge créatif sur l'image */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold text-gray-800 shadow-lg">
                      Œuvre #{i + 1}
                    </div>
                  </div>

                  {/* Effet de bordure animée */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-400/50 rounded-2xl transition-colors duration-500" />
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* Call to action - FIXED */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Prêt à rejoindre la communauté ?
            </h3>
            <p className="text-gray-600 mb-8">
              Que vous soyez infographiste, photographe, illustrateur ou artiste 3D, 
              ArTika est votre tremplin vers la reconnaissance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer text-center"
                >
                  Rejoindre ArTika
                </motion.div>
              </Link>
              <Link href="/feed">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-purple-600 font-semibold rounded-2xl shadow-lg border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 cursor-pointer text-center"
                >
                  Découvrir les œuvres
                </motion.div>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}