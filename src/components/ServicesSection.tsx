'use client'

import { motion } from 'framer-motion'
import { Palette, Globe, ShoppingCart, MessageCircle, LineChart, Users } from 'lucide-react'

const services = [
  {
    icon: <Palette size={32} className="text-blue-600" />,
    title: 'Portfolios Créatifs',
    desc: 'Créez un espace personnel pour exposer vos œuvres avec style.',
  },
  {
    icon: <Globe size={32} className="text-blue-600" />,
    title: 'Visibilité Internationale',
    desc: 'Soyez découvert par des passionnés d’art du monde entier.',
  },
  {
    icon: <ShoppingCart size={32} className="text-blue-600" />,
    title: 'Marketplace à venir',
    desc: 'Vendez vos œuvres directement sur la plateforme.',
  },
  {
    icon: <MessageCircle size={32} className="text-blue-600" />,
    title: 'Messagerie Interne',
    desc: 'Discutez avec d’autres artistes et acheteurs en toute simplicité.',
  },
  {
    icon: <LineChart size={32} className="text-blue-600" />,
    title: 'Statistiques Avancées',
    desc: 'Suivez l’évolution de vos vues, likes et enregistrements.',
  },
  {
    icon: <Users size={32} className="text-blue-600" />,
    title: 'Communauté Active',
    desc: 'Rejoignez un réseau d’artistes africains talentueux.',
  },
]

export default function ServicesSection() {
  return (
    <section className="bg-white py-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
          Nos Services pour les Artistes
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          Artika n’est pas qu’un simple réseau social. C’est un espace dédié à la valorisation de votre art, au partage, et à la croissance de votre carrière artistique.
        </p>

        {/* Cartes de services */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-lg transition duration-300 text-left"
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
              <p className="text-gray-600 text-sm">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
