import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { put } from '@vercel/blob'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const userId = searchParams.get('userId')

    const artworks = await prisma.artwork.findMany({
      where: {
        ...(category && { category }),
        ...(userId && { userId }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { user: { name: { contains: search, mode: 'insensitive' } } },
          ],
        }),
      },
      include: {
        user: {
          select: { id: true, name: true, firstName: true, lastName: true, image: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const mapped = artworks.map((art) => ({
      id: art.id,
      image: art.imageUrl,
      title: art.title,
      artist: art.user.name || `${art.user.firstName ?? ''} ${art.user.lastName ?? ''}`.trim(),
      artistId: art.userId,
      artistImage: art.user.image,
      tools: art.tools,
      category: art.category,
      likes: art.likes,
      views: art.views,
      popularity: art.popularity,
      description: art.description,
      year: art.year,
    }))

    return NextResponse.json(mapped)
  } catch (error) {
    console.error('GET /api/artworks:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

const ALLOWED_CATEGORIES = ['Photographie', '3D', '2D', 'Infographie', 'Sculpture', 'Peinture', 'Dessin', 'Art numérique']
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB
const CURRENT_YEAR = new Date().getFullYear()

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('image') as File | null
    const title = formData.get('title') as string
    const description = formData.get('description') as string | null
    const category = formData.get('category') as string
    const toolsRaw = formData.get('tools') as string
    const yearRaw = parseInt(formData.get('year') as string)

    // Validation
    if (!title || typeof title !== 'string' || title.trim().length === 0 || title.length > 200) {
      return NextResponse.json({ error: 'Titre invalide (1–200 caractères)' }, { status: 400 })
    }
    if (!category || !ALLOWED_CATEGORIES.includes(category)) {
      return NextResponse.json({ error: 'Catégorie invalide' }, { status: 400 })
    }
    if (isNaN(yearRaw) || yearRaw < 1900 || yearRaw > CURRENT_YEAR) {
      return NextResponse.json({ error: `Année invalide (1900–${CURRENT_YEAR})` }, { status: 400 })
    }
    if (description && description.length > 2000) {
      return NextResponse.json({ error: 'Description trop longue (max 2000 caractères)' }, { status: 400 })
    }
    if (!file) {
      return NextResponse.json({ error: 'Image obligatoire' }, { status: 400 })
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Fichier trop volumineux (max 10 Mo)' }, { status: 400 })
    }
    if (!ALLOWED_MIME.includes(file.type)) {
      return NextResponse.json({ error: 'Format non accepté (JPEG, PNG, WebP, GIF uniquement)' }, { status: 400 })
    }

    let tools: string[] = []
    try {
      tools = toolsRaw ? JSON.parse(toolsRaw) : []
      if (
        !Array.isArray(tools) ||
        tools.length > 20 ||
        !tools.every((t) => typeof t === 'string' && t.length <= 100)
      ) throw new Error()
    } catch {
      return NextResponse.json({ error: 'Format des outils invalide' }, { status: 400 })
    }

    const year = yearRaw

    const blob = await put(`artworks/${session.user.id}/${Date.now()}-${file.name}`, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    const artwork = await prisma.artwork.create({
      data: {
        title,
        description: description || undefined,
        imageUrl: blob.url,
        category,
        tools,
        year,
        userId: session.user.id,
      },
    })

    return NextResponse.json(artwork, { status: 201 })
  } catch (error) {
    console.error('POST /api/artworks:', error)
    return NextResponse.json({ error: 'Erreur lors de la publication' }, { status: 500 })
  }
}
