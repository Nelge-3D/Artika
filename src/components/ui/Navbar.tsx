import Link from 'next/link'
import { Home, Upload, User, Compass, Image } from 'lucide-react'
//import { cn } from '@/lib/utils' // si tu utilises Shadcn

const navItems = [
  { href: '/', icon: <Home size={20} />, label: 'Accueil' },
  { href: '/upload', icon: <Upload size={20} />, label: 'Publier' },
  { href: '/explore', icon: <Compass size={20} />, label: 'Explorer' },
  { href: '/auth/login', icon: <User size={20} />, label: 'Se connecter' },
]

const Navbar = () => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-16 bg-white border-r shadow-md flex flex-col items-center py-4 gap-6">
      {/* Logo (représenté par une icône ici, à adapter plus tard) */}
      <div className="text-blue-600 font-bold text-lg">
        <Image size={24} />
      </div>

      <nav className="flex flex-col gap-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group relative flex justify-center items-center hover:text-blue-600"
          >
            {item.icon}
            <span className="absolute left-12 z-10 scale-0 rounded bg-black px-2 py-1 text-xs text-white transition-all group-hover:scale-100">
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}

export default Navbar
