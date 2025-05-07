import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  try {
    // Create super admin if it doesn't exist
    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || "admin@playrental.com"
    const existingSuperAdmin = await prisma.user.findUnique({
      where: { email: superAdminEmail },
    })

    if (!existingSuperAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 10)

      await prisma.user.create({
        data: {
          name: "System Admin",
          email: superAdminEmail,
          passwordHash: hashedPassword,
          role: "SUPER_ADMIN",
          isEmailVerified: true,
        },
      })

      console.log("Super admin created successfully")
    } else {
      console.log("Super admin already exists")
    }

    // Sample users
    const playerPassword = await bcrypt.hash("password123", 10)
    const ownerPassword = await bcrypt.hash("password123", 10)

    const player = await prisma.user.upsert({
      where: { email: "player@example.com" },
      update: {
        isEmailVerified: true,
      },
      create: {
        name: "Sample Player",
        email: "player@example.com",
        passwordHash: playerPassword,
        role: "PLAYER",
        isEmailVerified: true,
      },
    })

    const owner = await prisma.user.upsert({
      where: { email: "owner@example.com" },
      update: {
        isEmailVerified: true,
      },
      create: {
        name: "Sample Owner",
        email: "owner@example.com",
        passwordHash: ownerPassword,
        role: "OWNER",
        isEmailVerified: true,
      },
    })

    // Delete any playgrounds without valid owners
    const orphanedPlaygrounds = await prisma.playground.findMany({
      where: {
        owner: {
          is: null,
        },
      },
    })

    if (orphanedPlaygrounds.length > 0) {
      console.log(`Deleting ${orphanedPlaygrounds.length} playgrounds without valid owners`)
      await prisma.playground.deleteMany({
        where: {
          id: {
            in: orphanedPlaygrounds.map((p) => p.id),
          },
        },
      })
    }

    // Sample playgrounds
    const playground1 = await prisma.playground.upsert({
      where: { id: "playground1" },
      update: {
        ownerId: owner.id,
        images: JSON.stringify(["/placeholder.svg?height=225&width=400"]),
      },
      create: {
        id: "playground1",
        name: "Downtown Basketball Court",
        description:
          "Professional basketball court in the heart of downtown. Features high-quality flooring and professional equipment.",
        address: "123 Main St",
        city: "Cairo",
        state: "Cairo",
        zipCode: "10001",
        price: 50,
        images: JSON.stringify(["/placeholder.svg?height=225&width=400"]),
        sportType: "Basketball",
        amenities: JSON.stringify(["Showers", "Lockers", "Water Fountains"]),
        isAvailable: true,
        ownerId: owner.id,
      },
    })

    const playground2 = await prisma.playground.upsert({
      where: { id: "playground2" },
      update: {
        ownerId: owner.id,
        images: JSON.stringify(["/placeholder.svg?height=225&width=400"]),
      },
      create: {
        id: "playground2",
        name: "Riverside Tennis Courts",
        description: "Beautiful tennis courts with a view of the river. Perfect for both casual and competitive play.",
        address: "456 River Rd",
        city: "Alexandria",
        state: "Alexandria",
        zipCode: "60601",
        price: 40,
        images: JSON.stringify(["/placeholder.svg?height=225&width=400"]),
        sportType: "Tennis",
        amenities: JSON.stringify(["Pro Shop", "Coaching Available", "Restrooms"]),
        isAvailable: true,
        ownerId: owner.id,
      },
    })

    // Sample booking
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const startTime = new Date(tomorrow)
    startTime.setHours(10, 0, 0, 0)

    const endTime = new Date(tomorrow)
    endTime.setHours(11, 0, 0, 0)

    const booking = await prisma.booking.upsert({
      where: { id: "booking1" },
      update: {
        userId: player.id,
        playgroundId: playground1.id,
      },
      create: {
        id: "booking1",
        startTime,
        endTime,
        status: "CONFIRMED",
        totalAmount: 50,
        userId: player.id,
        playgroundId: playground1.id,
      },
    })

    // Sample payment
    await prisma.payment.upsert({
      where: { bookingId: "booking1" },
      update: {
        userId: player.id,
      },
      create: {
        id: "payment1",
        amount: 50,
        status: "COMPLETED",
        method: "Credit Card",
        transactionId: "txn_123456",
        bookingId: booking.id,
        userId: player.id,
      },
    })

    // Sample review
    await prisma.review.upsert({
      where: { bookingId: "booking1" },
      update: {
        userId: player.id,
        playgroundId: playground1.id,
      },
      create: {
        id: "review1",
        rating: 5,
        comment: "Great court, well maintained!",
        userId: player.id,
        playgroundId: playground1.id,
        bookingId: booking.id,
      },
    })

    // Sample notification
    await prisma.notification.upsert({
      where: { id: "notification1" },
      update: {
        userId: player.id,
      },
      create: {
        id: "notification1",
        title: "Booking Confirmed",
        message: "Your booking for Downtown Basketball Court has been confirmed.",
        isRead: false,
        type: "BOOKING_CONFIRMATION",
        userId: player.id,
      },
    })

    console.log("Database seeded successfully")
  } catch (error) {
    console.error("Error seeding database:", error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
