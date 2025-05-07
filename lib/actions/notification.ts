"use server"

import { PrismaClient } from "@prisma/client"
import { getCurrentUser } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import type { Notification } from "@/types"

const prisma = new PrismaClient()

export async function getUserNotifications(): Promise<Notification[]> {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("You must be logged in to view your notifications")
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  })

  return notifications as Notification[]
}

export async function markNotificationAsRead(id: string): Promise<Notification> {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("You must be logged in to update notifications")
  }

  // Check if the notification belongs to the user
  const notification = await prisma.notification.findUnique({
    where: { id },
  })

  if (!notification) {
    throw new Error("Notification not found")
  }

  if (notification.userId !== user.id) {
    throw new Error("You don't have permission to update this notification")
  }

  const updatedNotification = await prisma.notification.update({
    where: { id },
    data: { isRead: true },
  })

  revalidatePath("/dashboard")

  return updatedNotification as Notification
}

export async function markAllNotificationsAsRead(): Promise<void> {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("You must be logged in to update notifications")
  }

  await prisma.notification.updateMany({
    where: { userId: user.id, isRead: false },
    data: { isRead: true },
  })

  revalidatePath("/dashboard")
}

export async function deleteNotification(id: string): Promise<void> {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("You must be logged in to delete notifications")
  }

  // Check if the notification belongs to the user
  const notification = await prisma.notification.findUnique({
    where: { id },
  })

  if (!notification) {
    throw new Error("Notification not found")
  }

  if (notification.userId !== user.id) {
    throw new Error("You don't have permission to delete this notification")
  }

  await prisma.notification.delete({
    where: { id },
  })

  revalidatePath("/dashboard")
}
