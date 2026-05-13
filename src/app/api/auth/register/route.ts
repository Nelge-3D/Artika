import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, password } = body

    // Validation des champs
    if (!firstName || typeof firstName !== 'string' || firstName.trim().length === 0 || firstName.length > 100) {
      return NextResponse.json({ error: 'Prénom invalide (1–100 caractères)' }, { status: 400 })
    }
    if (!lastName || typeof lastName !== 'string' || lastName.trim().length === 0 || lastName.length > 100) {
      return NextResponse.json({ error: 'Nom invalide (1–100 caractères)' }, { status: 400 })
    }
    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email) || email.length > 320) {
      return NextResponse.json({ error: 'Adresse email invalide' }, { status: 400 })
    }
    if (!password || typeof password !== 'string' || password.length < 8 || password.length > 128) {
      return NextResponse.json({ error: 'Mot de passe invalide (8–128 caractères)' }, { status: 400 })
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Un utilisateur avec cet email existe déjà" },
        { status: 400 }
      )
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12)

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        email,
        password: hashedPassword,
      }
    })

    return NextResponse.json({
      message: "Utilisateur créé avec succès",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      }
    })
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}