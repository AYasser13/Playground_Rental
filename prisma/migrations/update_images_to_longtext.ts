// This is a manual migration script to update the images column to LONGTEXT
// Run this with: npx ts-node prisma/migrations/update_images_to_longtext.ts

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  try {
    // Execute raw SQL to alter the column type
    await prisma.$executeRaw`ALTER TABLE playgrounds MODIFY images LONGTEXT;`
    console.log("Successfully updated images column to LONGTEXT")
  } catch (error) {
    console.error("Error updating column:", error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
