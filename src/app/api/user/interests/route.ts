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
      select: { interests: true },
    })

    return NextResponse.json({ interests: user?.interests ?? [] })
  } catch (error) {
    console.error('GET /api/user/interests:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { interests } = await request.json()

    if (
      !Array.isArray(interests) ||
      interests.length > 20 ||
      !interests.every((i) => typeof i === 'string' && i.length > 0 && i.length <= 100)
    ) {
      return NextResponse.json({ error: 'Format invalide' }, { status: 400 })
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { interests },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('PUT /api/user/interests:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
