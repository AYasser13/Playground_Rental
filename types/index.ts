export interface User {
  id: string
  email: string
  name: string
  role: "PLAYER" | "OWNER" | "SUPER_ADMIN"
  phone?: string
  isEmailVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Playground {
  id: string
  name: string
  description: string
  address: string
  city: string
  state: string
  zipCode: string
  price: number
  images: string // JSON string
  sportType: string
  amenities: string // JSON string
  isAvailable: boolean
  ownerId: string
  createdAt: Date
  updatedAt: Date
  reviews?: Review[]
}

export interface Booking {
  id: string
  startTime: Date
  endTime: Date
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"
  totalAmount: number
  notes?: string
  userId: string
  playgroundId: string
  createdAt: Date
  updatedAt: Date
  user?: User
  playground?: Playground
  payment?: Payment
  review?: Review
}

export interface Payment {
  id: string
  amount: number
  status: "PENDING" | "COMPLETED" | "REFUNDED" | "FAILED"
  method: string
  transactionId?: string
  bookingId: string
  userId: string
  createdAt: Date
  updatedAt: Date
  booking?: Booking
  user?: User
}

export interface Review {
  id: string
  rating: number
  comment?: string
  userId: string
  playgroundId: string
  bookingId: string
  createdAt: Date
  updatedAt: Date
  user?: User
  playground?: Playground
  booking?: Booking
}

export interface Notification {
  id: string
  title: string
  message: string
  isRead: boolean
  type: string
  userId: string
  createdAt: Date
  user?: User
}
