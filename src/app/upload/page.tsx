'use client'

import React, { useState, useCallback, useRef } from 'react'
import { Upload, X, Image, FileText, Eye, Plus, Trash2 } from 'lucide-react'

interface ArtworkForm {
  title: string
  description: string
  category: string
  tags: string[]
  price: string
  dimensions: {
    width: string
    height: string
    depth: string
  }
  material: string
  year: string
  availability: 'available' | 'sold' | 'exhibition'
}

const CATEGORIES = [
  'Photographie',
  '3D', 
  '2D',
  'Infographie',
  'Sculpture',
  'Peinture',
  'Dessin',
  'Art numérique'
]

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [currentTag, setCurrentTag] = useState('')
  const [previewIndex, setPreviewIndex] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState<ArtworkForm>({
    title: '',
    description: '',
    category: '',
    tags: [],
    price: '',
    dimensions: { width: '', height: '', depth: '' },
    material: '',
    year: new Date().getFullYear().toString(),
    availability: 'available'
  })

  // Gestion du drag & drop
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    )
    setFiles(prev => [...prev, ...droppedFiles])
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(file => 
        file.type.startsWith('image/')
      )
      setFiles(prev => [...prev, ...selectedFiles])
    }
  }, [])

  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
    if (previewIndex >= files.length - 1) {
      setPreviewIndex(Math.max(0, files.length - 2))
    }
  }, [files.length, previewIndex])

  const addTag = useCallback(() => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }))
      setCurrentTag('')
    }
  }, [currentTag, formData.tags])

  const removeTag = useCallback((tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }, [])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    // Logique de soumission
    console.log('Artwork data:', formData)
    console.log('Files:', files)
    // Ici vous ajouteriez l'appel API pour envoyer les données
  }, [formData, files])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Télécharger une œuvre
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Partagez votre création avec la communauté. Ajoutez vos images et remplissez les informations pour présenter votre œuvre.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Zone de téléchargement */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Upload className="h-6 w-6 text-purple-600" />
              Images de l'œuvre
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
                multiple
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
                    Glissez vos images ici ou cliquez pour sélectionner
                  </p>
                  <p className="text-gray-500 mt-2">
                    PNG, JPG, WEBP jusqu'à 10MB chacune
                  </p>
                </div>
              </div>
            </div>

            {/* Aperçu des fichiers */}
            {files.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Images sélectionnées ({files.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-purple-600 hover:text-purple-700 font-medium"
                  >
                    + Ajouter plus
                  </button>
                </div>
                
                {/* Aperçu principal */}
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
                
                {/* Miniatures */}
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
              </div>
            )}
          </div>

          {/* Informations de l'œuvre */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <FileText className="h-6 w-6 text-purple-600" />
              Informations de l'œuvre
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Titre */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre de l'œuvre *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Donnez un titre à votre œuvre"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Décrivez votre œuvre, votre inspiration, votre technique..."
                />
              </div>

              {/* Catégorie */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Année */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Année de création
                </label>
                <input
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={formData.year}
                  onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              {/* Dimensions */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dimensions (cm)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="number"
                    placeholder="Largeur"
                    value={formData.dimensions.width}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      dimensions: { ...prev.dimensions, width: e.target.value }
                    }))}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <input
                    type="number"
                    placeholder="Hauteur"
                    value={formData.dimensions.height}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      dimensions: { ...prev.dimensions, height: e.target.value }
                    }))}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <input
                    type="number"
                    placeholder="Profondeur"
                    value={formData.dimensions.depth}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      dimensions: { ...prev.dimensions, depth: e.target.value }
                    }))}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Matériau */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Matériau/Technique
                </label>
                <input
                  type="text"
                  value={formData.material}
                  onChange={(e) => setFormData(prev => ({ ...prev, material: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="ex: Huile sur toile, Bronze, Photographie numérique..."
                />
              </div>

              {/* Prix */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix (€)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Prix de vente (optionnel)"
                />
              </div>

              {/* Disponibilité */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Disponibilité
                </label>
                <div className="flex gap-4">
                  {[
                    { value: 'available', label: 'Disponible' },
                    { value: 'sold', label: 'Vendue' },
                    { value: 'exhibition', label: 'En exposition' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name="availability"
                        value={option.value}
                        checked={formData.availability === option.value}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          availability: e.target.value as typeof formData.availability 
                        }))}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Ajouter un tag (ex: portrait, abstrait, nature...)"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Ajouter
                  </button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
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

          {/* Boutons d'action */}
          <div className="flex justify-between items-center bg-white rounded-2xl shadow-lg p-6">
            <button
              type="button"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Sauvegarder comme brouillon
            </button>
            
            <div className="flex gap-3">
              <button
                type="button"
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Aperçu
              </button>
              <button
                type="submit"
                disabled={files.length === 0 || !formData.title || !formData.category}
                className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Publier l'œuvre
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}