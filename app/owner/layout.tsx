import type React from "react"
import { OwnerSidebar } from "@/components/owner/owner-sidebar"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function OwnerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "OWNER") {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen">
      <OwnerSidebar user={user} />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">{children}</div>
      </div>
    </div>
  )
}
