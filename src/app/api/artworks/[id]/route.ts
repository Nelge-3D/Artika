import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { id } = await params

    const artwork = await prisma.artwork.findUnique({ where: { id } })
    if (!artwork) {
      return NextResponse.json({ error: 'Introuvable' }, { status: 404 })
    }
    if (artwork.userId !== session.user.id) {
      return NextResponse.json({ error: 'Interdit' }, { status: 403 })
    }

    await prisma.artwork.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/artworks/[id]:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
