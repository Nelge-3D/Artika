// src/components/footer.tsx
export default function Footer() {
  return (
    <footer className="bg-white border-t mt-16 py-6">
      <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Artika. Tous droits réservés.
      </div>
    </footer>
  )
}
