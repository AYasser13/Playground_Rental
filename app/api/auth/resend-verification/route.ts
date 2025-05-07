import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { sendVerificationEmail } from "@/lib/email"
import crypto from "crypto"

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 })
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Check if email is already verified
    if (user.isEmailVerified) {
      return NextResponse.json({ message: "Email is already verified" }, { status: 400 })
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString("hex")

    // Update user with new verification token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken,
      },
    })

    // Send verification email
    await sendVerificationEmail(user.email, user.name, verificationToken)

    return NextResponse.json({ message: "Verification email sent successfully" })
  } catch (error) {
    console.error("Error resending verification email:", error)
    return NextResponse.json({ message: "An error occurred while resending verification email" }, { status: 500 })
  }
}
