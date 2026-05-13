'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mb-4">
          Oops
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Une erreur s&apos;est produite</h1>
        <p className="text-gray-500 mb-8">
          Quelque chose s&apos;est mal passé. Veuillez réessayer ou retourner à la galerie.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-medium transition"
          >
            Réessayer
          </button>
          <Link
            href="/feed"
            className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 rounded-full font-medium border border-gray-200 transition"
          >
            Voir la galerie
          </Link>
        </div>
      </div>
    </main>
  )
}
