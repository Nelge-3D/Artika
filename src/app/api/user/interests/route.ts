import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const user = await db.user.findUnique({
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

    if (!Array.isArray(interests)) {
      return NextResponse.json({ error: 'Format invalide' }, { status: 400 })
    }

    await db.user.update({
      where: { id: session.user.id },
      data: { interests },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('PUT /api/user/interests:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
