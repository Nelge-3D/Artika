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
    const year = parseInt(formData.get('year') as string) || new Date().getFullYear()

    if (!file || !title || !category) {
      return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 })
    }

    const tools: string[] = toolsRaw ? JSON.parse(toolsRaw) : []

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
    const message = error instanceof Error ? error.message : String(error)
    console.error('POST /api/artworks:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
