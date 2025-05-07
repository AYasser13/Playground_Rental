import { PrismaClient } from "@prisma/client"
import type { NextRequest } from "next/server"
import { cookies } from "next/headers"
import { verify, sign } from "jsonwebtoken"
import bcrypt from "bcryptjs"
import type { User } from "@/types"

const prisma = new PrismaClient()

// JWT Secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-for-development"
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d"

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10)
}

// Compare password with hash
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}

// Generate JWT token
export function generateToken(user: User): string {
  return sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    },
  )
}

// Verify JWT token
export function verifyToken(token: string): any {
  try {
    return verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

// Set JWT token in cookies
export function setTokenCookie(token: string): void {
  cookies().set({
    name: "token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

// Get JWT token from cookies - updated to be async
export async function getTokenFromCookies(): Promise<string | undefined> {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("token")
    return token?.value
  } catch (error) {
    console.error("Error getting token from cookies:", error)
    return undefined
  }
}

// Clear JWT token from cookies
export function clearTokenCookie(): void {
  cookies().delete("token")
}

// Get current user from token - updated to handle async getTokenFromCookies
export async function getCurrentUser(): Promise<User | null> {
  try {
    const token = await getTokenFromCookies()
    if (!token) return null

    const decoded = verifyToken(token)
    if (!decoded) return null

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return user as User
  } catch (error) {
    console.error("Error fetching current user:", error)
    return null
  }
}

// Middleware to check if user is authenticated
export async function isAuthenticated(req: NextRequest): Promise<User | null> {
  const user = await getCurrentUser()
  return user
}

// Middleware to check if user has required role
export async function hasRole(req: NextRequest, roles: string[]): Promise<User | null> {
  const user = await isAuthenticated(req)
  if (!user) return null
  if (!roles.includes(user.role)) return null
  return user
}
