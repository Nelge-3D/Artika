'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Save, User, MapPin, Globe, Instagram, FileText, CheckCircle, AlertCircle, Camera } from 'lucide-react'
import UserAvatar from '@/components/ui/UserAvatar'

interface ProfileForm {
  firstName: string
  lastName: string
  bio: string
  location: string
  website: string
  instagram: string
}

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState<ProfileForm>({
    firstName: '',
    lastName: '',
    bio: '',
    location: '',
    website: '',
    instagram: '',
  })
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login')
  }, [status, router])

  useEffect(() => {
    if (status !== 'authenticated') return
    fetch('/api/user/profile')
      .then((r) => r.json())
      .then((data) => {
        setForm({
          firstName: data.firstName ?? '',
          lastName: data.lastName ?? '',
          bio: data.bio ?? '',
          location: data.location ?? '',
          website: data.website ?? '',
          instagram: data.instagram ?? '',
        })
        setAvatarUrl(data.image ?? null)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [status])

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingAvatar(true)
    setFeedback(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/user/avatar', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) {
        setFeedback({ type: 'error', message: data.error || 'Erreur lors de l\'upload' })
      } else {
        setAvatarUrl(data.url)
        setFeedback({ type: 'success', message: 'Photo de profil mise à jour !' })
        setTimeout(() => setFeedback(null), 4000)
      }
    } catch {
      setFeedback({ type: 'error', message: 'Erreur réseau. Veuillez réessayer.' })
    } finally {
      setUploadingAvatar(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setFeedback(null)
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setFeedback({ type: 'error', message: data.error || 'Erreur lors de la sauvegarde' })
      } else {
        setFeedback({ type: 'success', message: 'Profil mis à jour avec succès !' })
        setTimeout(() => setFeedback(null), 4000)
      }
    } catch {
      setFeedback({ type: 'error', message: 'Erreur réseau. Veuillez réessayer.' })
    } finally {
      setSaving(false)
    }
  }

  const displayName = form.firstName && form.lastName
    ? `${form.firstName} ${form.lastName}`
    : session?.user?.name || session?.user?.email?.split('@')[0] || 'Artiste'

  const currentAvatar = avatarUrl ?? session?.user?.image ?? null

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 lg:pl-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-gray-50 lg:pl-20 xl:pl-24 pb-24 lg:pb-0">
      <div className="max-w-2xl mx-auto px-4 py-8 pt-20 lg:pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Paramètres du profil</h1>
          <p className="text-gray-500 text-sm mb-8">Ces informations apparaîtront sur votre page artiste publique.</p>

          {/* Aperçu avatar */}
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm flex items-center gap-4">
            <div className="relative group">
              <UserAvatar name={displayName} src={currentAvatar} size={72} />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                aria-label="Changer la photo de profil"
              >
                {uploadingAvatar
                  ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <Camera className="w-5 h-5 text-white" />}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{displayName}</p>
              <p className="text-sm text-gray-500">{session.user?.email}</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="text-xs text-purple-600 hover:text-purple-700 mt-1 transition-colors"
              >
                {uploadingAvatar ? 'Upload en cours…' : 'Changer la photo'}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nom */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                <User className="w-4 h-4" /> Identité
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                  <input
                    type="text"
                    maxLength={100}
                    value={form.firstName}
                    onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    placeholder="Jean"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input
                    type="text"
                    maxLength={100}
                    value={form.lastName}
                    onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    placeholder="Dupont"
                  />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Bio
              </h2>
              <textarea
                rows={4}
                maxLength={500}
                value={form.bio}
                onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm resize-none"
                placeholder="Parlez de votre style, vos influences, vos projets..."
              />
              <p className="text-right text-xs text-gray-400 mt-1">{form.bio.length}/500</p>
            </div>

            {/* Localisation */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Localisation
              </h2>
              <input
                type="text"
                maxLength={100}
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                placeholder="Libreville, Gabon"
              />
            </div>

            {/* Liens */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4" /> Liens
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-gray-400" /> Site web
                  </label>
                  <input
                    type="text"
                    maxLength={200}
                    value={form.website}
                    onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    placeholder="monsite.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Instagram className="w-3.5 h-3.5 text-gray-400" /> Instagram
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
                    <input
                      type="text"
                      maxLength={100}
                      value={form.instagram}
                      onChange={(e) => setForm((f) => ({ ...f, instagram: e.target.value.replace('@', '') }))}
                      className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      placeholder="nom_utilisateur"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Feedback */}
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm ${
                  feedback.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {feedback.type === 'success'
                  ? <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                {feedback.message}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-medium py-3 rounded-xl transition"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Sauvegarde…' : 'Enregistrer les modifications'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
