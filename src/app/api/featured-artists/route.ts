import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: { featured: true },
      orderBy: { featuredOrder: 'asc' },
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        image: true,
        bio: true,
        featuredOrder: true,
      },
    })

    const artists = users.map((u) => ({
      id: u.id,
      name: u.name || `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim(),
      image: u.image ?? null,
      bio: u.bio ?? null,
    }))

    return NextResponse.json(artists)
  } catch (error) {
    console.error('GET /api/featured-artists:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
