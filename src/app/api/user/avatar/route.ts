import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { put, del } from '@vercel/blob'

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024 // 5 MB

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) return NextResponse.json({ error: 'Fichier manquant' }, { status: 400 })
    if (!ALLOWED_MIME.includes(file.type)) {
      return NextResponse.json({ error: 'Format non supporté (JPEG, PNG, WebP uniquement)' }, { status: 400 })
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'Image trop lourde (max 5 Mo)' }, { status: 400 })
    }

    const ext = file.type.split('/')[1]
    const filename = `avatars/${session.user.id}/avatar.${ext}`

    // Delete old blob if it's hosted on Vercel Blob
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { image: true },
    })
    if (currentUser?.image?.includes('blob.vercel-storage.com')) {
      try { await del(currentUser.image, { token: process.env.BLOB_READ_WRITE_TOKEN }) } catch {}
    }

    const blob = await put(filename, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType: file.type,
    })

    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: blob.url },
    })

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error('POST /api/user/avatar:', error)
    return NextResponse.json({ error: 'Erreur lors de l\'upload' }, { status: 500 })
  }
}
