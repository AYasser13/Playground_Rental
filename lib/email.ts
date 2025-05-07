import nodemailer from "nodemailer"

// Create a transporter using environment variables
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "sandbox.smtp.mailtrap.io",
  port: Number.parseInt(process.env.EMAIL_PORT || "2525"),
  auth: {
    user: process.env.EMAIL_USER || "",
    pass: process.env.EMAIL_PASS || "",
  },
})

// Send verification email
export async function sendVerificationEmail(email: string, name: string, token: string): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const verificationUrl = `${appUrl}/verify-email?token=${token}`

  const mailOptions = {
    from: process.env.EMAIL_FROM || "noreply@playground.dev",
    to: email,
    subject: "Verify your email address",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Hello ${name},</h2>
        <p>Thank you for registering with PlayRental. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #0D99FF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Email</a>
        </div>
        <p>If you didn't create an account with us, you can safely ignore this email.</p>
        <p>This link will expire in 24 hours.</p>
        <p>Best regards,<br>The PlayRental Team</p>
      </div>
    `,
  }

  try {
    // For development, log the verification URL instead of sending an email
    if (process.env.NODE_ENV === "development") {
      console.log("Verification URL:", verificationUrl)
      return
    }

    await transporter.sendMail(mailOptions)
    console.log(`Verification email sent to ${email}`)
  } catch (error) {
    console.error("Error sending verification email:", error)
    throw new Error("Failed to send verification email")
  }
}

// Send password reset email
export async function sendPasswordResetEmail(email: string, name: string, token: string): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const resetUrl = `${appUrl}/reset-password?token=${token}`

  const mailOptions = {
    from: process.env.EMAIL_FROM || "noreply@playground.dev",
    to: email,
    subject: "Reset your password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Hello ${name},</h2>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #0D99FF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
        </div>
        <p>If you didn't request a password reset, you can safely ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
        <p>Best regards,<br>The PlayRental Team</p>
      </div>
    `,
  }

  try {
    // For development, log the reset URL instead of sending an email
    if (process.env.NODE_ENV === "development") {
      console.log("Password reset URL:", resetUrl)
      return
    }

    await transporter.sendMail(mailOptions)
    console.log(`Password reset email sent to ${email}`)
  } catch (error) {
    console.error("Error sending password reset email:", error)
    throw new Error("Failed to send password reset email")
  }
}

// Send booking confirmation email
export async function sendBookingConfirmationEmail(
  email: string,
  name: string,
  bookingDetails: {
    id: string
    playgroundName: string
    date: string
    startTime: string
    endTime: string
    totalAmount: string
  },
): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const bookingUrl = `${appUrl}/dashboard/bookings/${bookingDetails.id}`

  const mailOptions = {
    from: process.env.EMAIL_FROM || "noreply@playground.dev",
    to: email,
    subject: "Booking Confirmation",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Hello ${name},</h2>
        <p>Your booking has been confirmed. Here are the details:</p>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 4px; margin: 20px 0;">
          <p><strong>Playground:</strong> ${bookingDetails.playgroundName}</p>
          <p><strong>Date:</strong> ${bookingDetails.date}</p>
          <p><strong>Time:</strong> ${bookingDetails.startTime} - ${bookingDetails.endTime}</p>
          <p><strong>Total Amount:</strong> ${bookingDetails.totalAmount}</p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${bookingUrl}" style="background-color: #0D99FF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Booking</a>
        </div>
        <p>Thank you for using PlayRental!</p>
        <p>Best regards,<br>The PlayRental Team</p>
      </div>
    `,
  }

  try {
    // For development, log the booking URL instead of sending an email
    if (process.env.NODE_ENV === "development") {
      console.log("Booking confirmation URL:", bookingUrl)
      return
    }

    await transporter.sendMail(mailOptions)
    console.log(`Booking confirmation email sent to ${email}`)
  } catch (error) {
    console.error("Error sending booking confirmation email:", error)
    throw new Error("Failed to send booking confirmation email")
  }
}
