import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          404
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page introuvable</h1>
        <p className="text-gray-500 mb-8">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/feed"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-medium transition"
          >
            Voir la galerie
          </Link>
          <Link
            href="/"
            className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 rounded-full font-medium border border-gray-200 transition"
          >
            Accueil
          </Link>
        </div>
      </div>
    </main>
  )
}
