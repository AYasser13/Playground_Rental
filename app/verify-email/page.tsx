"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const email = searchParams.get("email")

  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { toast } = useToast()

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) return

      setIsVerifying(true)
      setError(null)

      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.message || "Email verification failed")
        }

        setIsVerified(true)
        toast({
          title: "Email verified",
          description: "Your email has been successfully verified. You can now log in.",
        })
      } catch (error) {
        console.error("Email verification error:", error)
        setError(error instanceof Error ? error.message : "An error occurred during email verification")
        toast({
          title: "Verification failed",
          description: error instanceof Error ? error.message : "An error occurred during email verification",
          variant: "destructive",
        })
      } finally {
        setIsVerifying(false)
      }
    }

    if (token) {
      verifyEmail()
    }
  }, [token, toast])

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
          <CardDescription>
            {token
              ? "We're verifying your email address..."
              : email
                ? `We've sent a verification email to ${email}. Please check your inbox and click the verification link.`
                : "Please check your email for a verification link."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center space-y-4 py-4">
            {isVerifying ? (
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p>Verifying your email...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center space-y-4 text-center">
                <XCircle className="h-12 w-12 text-destructive" />
                <p className="text-destructive">{error}</p>
              </div>
            ) : isVerified ? (
              <div className="flex flex-col items-center space-y-4 text-center">
                <CheckCircle className="h-12 w-12 text-primary" />
                <p>Your email has been successfully verified!</p>
              </div>
            ) : (
              <div className="text-center">
                <p className="mb-4">
                  If you haven't received the email, please check your spam folder or request a new verification email.
                </p>
                {email && (
                  <Button
                    variant="outline"
                    onClick={async () => {
                      try {
                        const res = await fetch("/api/auth/resend-verification", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({ email }),
                        })

                        const data = await res.json()

                        if (!res.ok) {
                          throw new Error(data.message || "Failed to resend verification email")
                        }

                        toast({
                          title: "Email sent",
                          description: "A new verification email has been sent to your inbox.",
                        })
                      } catch (error) {
                        console.error("Error resending verification email:", error)
                        toast({
                          title: "Failed to resend email",
                          description: error instanceof Error ? error.message : "An error occurred",
                          variant: "destructive",
                        })
                      }
                    }}
                  >
                    Resend Verification Email
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          {isVerified ? (
            <Button asChild>
              <Link href="/login">Go to Login</Link>
            </Button>
          ) : (
            <Button asChild variant="outline">
              <Link href="/">Return to Home</Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
