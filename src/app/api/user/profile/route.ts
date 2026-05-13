import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        email: true,
        image: true,
        bio: true,
        location: true,
        website: true,
        instagram: true,
      },
    })

    if (!user) return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 })
    return NextResponse.json(user)
  } catch (error) {
    console.error('GET /api/user/profile:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body = await request.json()
    const { firstName, lastName, bio, location, website, instagram } = body

    // Validation
    if (firstName !== undefined && (typeof firstName !== 'string' || firstName.trim().length === 0 || firstName.length > 100)) {
      return NextResponse.json({ error: 'Prénom invalide (1–100 caractères)' }, { status: 400 })
    }
    if (lastName !== undefined && (typeof lastName !== 'string' || lastName.trim().length === 0 || lastName.length > 100)) {
      return NextResponse.json({ error: 'Nom invalide (1–100 caractères)' }, { status: 400 })
    }
    if (bio !== undefined && (typeof bio !== 'string' || bio.length > 500)) {
      return NextResponse.json({ error: 'Bio invalide (max 500 caractères)' }, { status: 400 })
    }
    if (location !== undefined && (typeof location !== 'string' || location.length > 100)) {
      return NextResponse.json({ error: 'Localisation invalide (max 100 caractères)' }, { status: 400 })
    }
    if (website !== undefined && website !== '' && (typeof website !== 'string' || website.length > 200)) {
      return NextResponse.json({ error: 'Site web invalide (max 200 caractères)' }, { status: 400 })
    }
    if (instagram !== undefined && instagram !== '' && (typeof instagram !== 'string' || instagram.length > 100)) {
      return NextResponse.json({ error: 'Instagram invalide (max 100 caractères)' }, { status: 400 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(firstName !== undefined && { firstName: firstName.trim() }),
        ...(lastName !== undefined && { lastName: lastName.trim() }),
        ...(firstName !== undefined && lastName !== undefined && {
          name: `${firstName.trim()} ${lastName.trim()}`,
        }),
        ...(bio !== undefined && { bio: bio.trim() || null }),
        ...(location !== undefined && { location: location.trim() || null }),
        ...(website !== undefined && { website: website.trim() || null }),
        ...(instagram !== undefined && { instagram: instagram.trim() || null }),
      },
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        bio: true,
        location: true,
        website: true,
        instagram: true,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('PUT /api/user/profile:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
