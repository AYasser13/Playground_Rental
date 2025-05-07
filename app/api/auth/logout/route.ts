import { type NextRequest, NextResponse } from "next/server"
import { clearTokenCookie } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    // Clear token cookie
    clearTokenCookie()

    return NextResponse.json({ message: "Logout successful" })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ message: "An error occurred during logout" }, { status: 500 })
  }
}
