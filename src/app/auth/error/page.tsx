'use client'
import { motion } from 'framer-motion'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'CredentialsSignin':
        return 'Email ou mot de passe incorrect'
      case 'OAuthSignin':
        return 'Erreur lors de la connexion avec le provider'
      case 'OAuthCallback':
        return 'Erreur lors du callback OAuth'
      case 'OAuthCreateAccount':
        return 'Erreur lors de la création du compte OAuth'
      case 'EmailCreateAccount':
        return 'Erreur lors de la création du compte par email'
      case 'Callback':
        return 'Erreur lors du callback'
      case 'OAuthAccountNotLinked':
        return 'Ce compte est déjà associé à un autre provider'
      case 'EmailSignin':
        return 'Erreur lors de l\'envoi de l\'email'
      case 'CredentialsSignup':
        return 'Erreur lors de l\'inscription'
      case 'SessionRequired':
        return 'Vous devez être connecté pour accéder à cette page'
      default:
        return 'Une erreur inattendue s\'est produite'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="mx-auto w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mb-4"
          >
            <AlertCircle className="w-8 h-8 text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-gray-800 mb-2"
          >
            Erreur d'authentification
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600"
          >
            {getErrorMessage(error)}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-red-100"
        >
          <div className="p-6 sm:p-8">
            <div className="text-center space-y-4">
              <p className="text-gray-600 text-sm">
                Ne vous inquiétez pas, vous pouvez réessayer de vous connecter.
              </p>
              
              <div className="flex flex-col gap-3">
                <Link
                  href="/auth/login"
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Retour à la connexion
                </Link>
                
                <Link
                  href="/auth/register"
                  className="w-full bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center"
                >
                  Créer un nouveau compte
                </Link>
                
                <Link
                  href="/"
                  className="text-purple-600 hover:text-purple-800 font-medium text-sm"
                >
                  Retour à l'accueil
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center text-sm text-gray-500"
        >
          © {new Date().getFullYear()} ArTika. Tous droits réservés.
        </motion.div>
      </motion.div>
    </div>
  )
}