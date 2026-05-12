'use client'

import React, { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, X, Image, FileText, Eye, Plus } from 'lucide-react'

interface ArtworkForm {
  title: string
  description: string
  category: string
  tools: string[]
  year: string
}

const CATEGORIES = [
  'Photographie',
  '3D',
  '2D',
  'Infographie',
  'Sculpture',
  'Peinture',
  'Dessin',
  'Art numérique',
]

export default function UploadPage() {
  const router = useRouter()
  const [files, setFiles] = useState<File[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [currentTag, setCurrentTag] = useState('')
  const [previewIndex, setPreviewIndex] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<ArtworkForm>({
    title: '',
    description: '',
    category: '',
    tools: [],
    year: new Date().getFullYear().toString(),
  })

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type === 'dragenter' || e.type === 'dragover')
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const dropped = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'))
    setFiles((prev) => [...prev, ...dropped])
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files).filter((f) => f.type.startsWith('image/'))
      setFiles((prev) => [...prev, ...selected])
    }
  }, [])

  const removeFile = useCallback(
    (index: number) => {
      setFiles((prev) => prev.filter((_, i) => i !== index))
      if (previewIndex >= files.length - 1) setPreviewIndex(Math.max(0, files.length - 2))
    },
    [files.length, previewIndex]
  )

  const addTool = useCallback(() => {
    const tag = currentTag.trim()
    if (tag && !formData.tools.includes(tag)) {
      setFormData((prev) => ({ ...prev, tools: [...prev.tools, tag] }))
      setCurrentTag('')
    }
  }, [currentTag, formData.tools])

  const removeTool = useCallback((tool: string) => {
    setFormData((prev) => ({ ...prev, tools: prev.tools.filter((t) => t !== tool) }))
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (files.length === 0 || !formData.title || !formData.category) return

      setSubmitting(true)
      setError(null)

      try {
        const body = new FormData()
        body.append('image', files[0])
        body.append('title', formData.title)
        body.append('description', formData.description)
        body.append('category', formData.category)
        body.append('tools', JSON.stringify(formData.tools))
        body.append('year', formData.year)

        const res = await fetch('/api/artworks', { method: 'POST', body })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Erreur lors de la publication')
        }

        router.push('/feed')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors de la publication')
      } finally {
        setSubmitting(false)
      }
    },
    [files, formData, router]
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Télécharger une œuvre</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Partagez votre création avec la communauté ArTika.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Zone de téléchargement */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Upload className="h-6 w-6 text-purple-600" />
              Image de l'œuvre
            </h2>

            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                dragActive
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <Image className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <p className="text-xl font-medium text-gray-900">
                    Glissez votre image ici ou cliquez pour sélectionner
                  </p>
                  <p className="text-gray-500 mt-2">PNG, JPG, WEBP jusqu'à 10 MB</p>
                </div>
              </div>
            </div>

            {files.length > 0 && (
              <div className="mt-6">
                <div className="relative bg-gray-100 rounded-lg aspect-video mb-4 overflow-hidden">
                  <img
                    src={URL.createObjectURL(files[previewIndex])}
                    alt="Aperçu"
                    className="w-full h-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(previewIndex)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                {files.length > 1 && (
                  <div className="grid grid-cols-6 gap-2">
                    {files.map((file, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setPreviewIndex(index)}
                        className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                          index === previewIndex ? 'border-purple-500' : 'border-gray-200'
                        }`}
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Miniature ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Informations */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <FileText className="h-6 w-6 text-purple-600" />
              Informations de l'œuvre
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Donnez un titre à votre œuvre"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Décrivez votre œuvre, votre inspiration, votre technique..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Année de création
                </label>
                <input
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={formData.year}
                  onChange={(e) => setFormData((p) => ({ ...p, year: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Outils / Techniques
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTool())}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="ex: Blender, Photoshop, Procreate..."
                  />
                  <button
                    type="button"
                    onClick={addTool}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Ajouter
                  </button>
                </div>
                {formData.tools.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tools.map((tool) => (
                      <span
                        key={tool}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                      >
                        {tool}
                        <button
                          type="button"
                          onClick={() => removeTool(tool)}
                          className="text-purple-500 hover:text-purple-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end items-center bg-white rounded-2xl shadow-lg p-6">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={files.length === 0 || !formData.title || !formData.category || submitting}
                className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                {submitting ? 'Publication...' : "Publier l'œuvre"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
