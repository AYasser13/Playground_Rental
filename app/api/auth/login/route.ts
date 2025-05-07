import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { comparePassword, generateToken, setTokenCookie } from "@/lib/auth"

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.passwordHash)
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      // In development mode, auto-verify the user
      if (process.env.NODE_ENV === "development") {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            isEmailVerified: true,
            verificationToken: null,
          },
        })
      } else {
        return NextResponse.json({ message: "Please verify your email before logging in" }, { status: 401 })
      }
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isEmailVerified: user.isEmailVerified || process.env.NODE_ENV === "development",
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })

    // Set token in cookie
    setTokenCookie(token)

    // Return user data (excluding sensitive information)
    return NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        isEmailVerified: user.isEmailVerified || process.env.NODE_ENV === "development",
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "An error occurred during login" }, { status: 500 })
  }
}
