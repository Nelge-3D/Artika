'use client'
import { useSession, signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
import { 
  User, 
  LogOut, 
  Palette, 
  Settings, 
  Heart, 
  Image, 
  Plus,
  Grid,
  Camera,
  Bookmark,
  TrendingUp,
  Users,
  MessageCircle,
  Search,
  ChevronRight,
  Zap,
  Layers,
  Brush,
  Monitor,
  Smartphone,
  Video,
  MousePointer,
  Sparkles
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/auth/login')
    }
  }, [status, router])

  // Récupération des intérêts depuis l'URL si on revient du feed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const interests = urlParams.get('interests')
      if (interests) {
        setSelectedInterests(interests.split(','))
      }
    }
  }, [])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </motion.div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth/login' })
  }

  const interests = [
    { 
      id: 'illustration', 
      label: 'Illustration', 
      icon: Brush, 
      gradient: 'from-pink-500 to-rose-500',
      description: 'Art numérique, dessins et illustrations créatives'
    },
    { 
      id: '3d', 
      label: 'Art 3D', 
      icon: Layers, 
      gradient: 'from-blue-500 to-cyan-500',
      description: 'Modélisation, rendu et animation 3D'
    },
    { 
      id: 'infographie', 
      label: 'Infographie', 
      icon: Monitor, 
      gradient: 'from-green-500 to-emerald-500',
      description: 'Design graphique et identité visuelle'
    },
    { 
      id: 'ui-ux', 
      label: 'UI/UX Design', 
      icon: Smartphone, 
      gradient: 'from-purple-500 to-violet-500',
      description: 'Interfaces utilisateur et expérience digitale'
    },
    { 
      id: 'motion', 
      label: 'Motion Design', 
      icon: Video, 
      gradient: 'from-orange-500 to-red-500',
      description: 'Animation et design en mouvement'
    },
    { 
      id: 'web-design', 
      label: 'Web Design', 
      icon: MousePointer, 
      gradient: 'from-indigo-500 to-blue-500',
      description: 'Sites web et interfaces digitales'
    },
    { 
      id: 'photographie', 
      label: 'Photographie', 
      icon: Camera, 
      gradient: 'from-gray-500 to-slate-500',
      description: 'Photographie artistique et commerciale'
    },
    { 
      id: 'art-generatif', 
      label: 'Art Génératif', 
      icon: Sparkles, 
      gradient: 'from-yellow-500 to-amber-500',
      description: 'Art créé par algorithmes et IA'
    }
  ]

  const handleInterestToggle = (interestId: string) => {
    setSelectedInterests(prev => 
      prev.includes(interestId) 
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    )
  }

  const handleGoToFeed = () => {
    if (selectedInterests.length > 0) {
      // Rediriger vers le feed existant avec les intérêts sélectionnés
      router.push(`/feed?interests=${selectedInterests.join(',')}`)
    }
  }

  const mockFeedItems = [
    { 
      id: 1, 
      title: "Interface mobile minimaliste", 
      author: "Marie Dubois", 
      likes: 245, 
      views: "12.3k",
      category: "ui-ux",
      image: "/api/placeholder/400/300"
    },
    { 
      id: 2, 
      title: "Illustration vectorielle", 
      author: "Pierre Martin", 
      likes: 189, 
      views: "8.7k",
      category: "illustration",
      image: "/api/placeholder/400/300"
    },
    { 
      id: 3, 
      title: "Rendu 3D architectural", 
      author: "Sophie Chen", 
      likes: 312, 
      views: "15.2k",
      category: "3d",
      image: "/api/placeholder/400/300"
    },
    { 
      id: 4, 
      title: "Animation fluide", 
      author: "Alex Rivera", 
      likes: 156, 
      views: "6.9k",
      category: "motion",
      image: "/api/placeholder/400/300"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm border-b border-purple-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Palette className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">ArTika</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-gray-600 hover:text-purple-600 font-medium"
              >
                ← Retour aux intérêts
              </button>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">
                    {session.user?.name || `${session.user?.firstName} ${session.user?.lastName}`}
                  </p>
                  <p className="text-xs text-gray-500">{session.user?.email}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Bienvenue sur ArTika, {session.user?.name || session.user?.firstName} ! 🎨
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Découvrez des créations inspirantes adaptées à vos passions créatives
          </p>
          <div className="flex items-center justify-center space-x-2 text-purple-600">
            <Zap className="w-5 h-5" />
            <span className="font-medium">Sélectionnez vos domaines d'intérêt pour commencer</span>
          </div>
        </motion.div>

        {/* Interests Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Quels types de créations vous inspirent ?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {interests.map((interest, index) => (
              <motion.div
                key={interest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                onClick={() => handleInterestToggle(interest.id)}
                className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 ${
                  selectedInterests.includes(interest.id)
                    ? `border-transparent bg-gradient-to-r ${interest.gradient} text-white shadow-lg scale-105`
                    : 'border-purple-100 bg-white hover:border-purple-300 hover:shadow-md'
                }`}
              >
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    selectedInterests.includes(interest.id)
                      ? 'bg-white/20'
                      : `bg-gradient-to-r ${interest.gradient} text-white`
                  }`}>
                    <interest.icon className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">{interest.label}</h4>
                  <p className={`text-sm ${
                    selectedInterests.includes(interest.id)
                      ? 'text-white/80'
                      : 'text-gray-600'
                  }`}>
                    {interest.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          {selectedInterests.length > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleGoToFeed}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-3 mx-auto"
            >
              <span>Découvrir mon feed personnalisé</span>
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          )}
          
          {selectedInterests.length === 0 && (
            <p className="text-gray-500 text-lg">
              Sélectionnez au moins un domaine d'intérêt pour continuer
            </p>
          )}
        </motion.div>

        {/* Selection Counter */}
        {selectedInterests.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-full shadow-lg"
          >
            <span className="font-medium">
              {selectedInterests.length} sélectionné{selectedInterests.length > 1 ? 's' : ''}
            </span>
          </motion.div>
        )}
      </div>
    </div>
  )
}