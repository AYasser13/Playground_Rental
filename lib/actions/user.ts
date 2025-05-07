"use server"

import { PrismaClient } from "@prisma/client"
import { getCurrentUser } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import type { User } from "@/types"

const prisma = new PrismaClient()

export async function getAllUsers(): Promise<User[]> {
  const currentUser = await getCurrentUser()

  if (!currentUser || currentUser.role !== "SUPER_ADMIN") {
    throw new Error("You must be logged in as an admin to view all users")
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  })

  return users as User[]
}

export async function deleteUser(id: string): Promise<void> {
  const currentUser = await getCurrentUser()

  if (!currentUser || currentUser.role !== "SUPER_ADMIN") {
    throw new Error("You must be logged in as an admin to delete a user")
  }

  // Check if the user exists
  const user = await prisma.user.findUnique({
    where: { id },
  })

  if (!user) {
    throw new Error("User not found")
  }

  // Prevent deleting super admin
  if (user.role === "SUPER_ADMIN") {
    throw new Error("Cannot delete a super admin user")
  }

  // Delete the user
  await prisma.user.delete({
    where: { id },
  })

  revalidatePath("/admin/users")
}

export async function updateUserProfile(data: {
  name: string
  phone?: string
}): Promise<User> {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    throw new Error("You must be logged in to update your profile")
  }

  const updatedUser = await prisma.user.update({
    where: { id: currentUser.id },
    data: {
      name: data.name,
      phone: data.phone,
    },
  })

  revalidatePath("/profile")

  return updatedUser as User
}
