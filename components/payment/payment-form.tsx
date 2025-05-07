"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatCurrency } from "@/lib/utils"
import { Loader2, CreditCard, AlertCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface PaymentFormProps {
  amount: number
  onPaymentSuccess: (paymentMethod: string) => void
  isProcessing: boolean
}

export function PaymentForm({ amount, onPaymentSuccess, isProcessing }: PaymentFormProps) {
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("credit_card")
  const [simulateError, setSimulateError] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPaymentError(null)

    // Basic validation
    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      setPaymentError("Please fill in all required fields")
      return
    }

    // Simulate payment processing
    if (simulateError && cardNumber.startsWith("4111")) {
      setPaymentError("Payment failed: Card declined. Please try another card.")
      return
    }

    // Process payment (simulated)
    onPaymentSuccess(paymentMethod)
  }

  const formatCardNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "")

    // Add space after every 4 digits
    let formatted = ""
    for (let i = 0; i < digits.length; i += 4) {
      formatted += digits.slice(i, i + 4) + " "
    }

    return formatted.trim()
  }

  const formatExpiryDate = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "")

    // Format as MM/YY
    if (digits.length > 2) {
      return digits.slice(0, 2) + "/" + digits.slice(2, 4)
    }
    return digits
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-lg bg-muted p-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">Total Amount</span>
          <span className="font-bold">{formatCurrency(amount)}</span>
        </div>
      </div>

      {paymentError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{paymentError}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="payment-method">Payment Method</Label>
        <Select value={paymentMethod} onValueChange={setPaymentMethod} disabled={isProcessing}>
          <SelectTrigger id="payment-method">
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="credit_card">Credit Card</SelectItem>
            <SelectItem value="debit_card">Debit Card</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="card-number">Card Number</Label>
        <Input
          id="card-number"
          placeholder="1234 5678 9012 3456"
          value={cardNumber}
          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
          maxLength={19}
          disabled={isProcessing}
          required
        />
        <p className="text-xs text-muted-foreground">
          For testing: Use any card number. Start with 4111 to simulate a failed payment.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="card-name">Cardholder Name</Label>
        <Input
          id="card-name"
          placeholder="John Doe"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          disabled={isProcessing}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expiry-date">Expiry Date</Label>
          <Input
            id="expiry-date"
            placeholder="MM/YY"
            value={expiryDate}
            onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
            maxLength={5}
            disabled={isProcessing}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cvv">CVV</Label>
          <Input
            id="cvv"
            placeholder="123"
            value={cvv}
            onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
            maxLength={3}
            disabled={isProcessing}
            required
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="simulate-error"
          checked={simulateError}
          onChange={(e) => setSimulateError(e.target.checked)}
          disabled={isProcessing}
        />
        <Label htmlFor="simulate-error" className="text-sm">
          Enable error simulation (for testing)
        </Label>
      </div>

      <Button type="submit" className="w-full" disabled={isProcessing}>
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Pay {formatCurrency(amount)}
          </>
        )}
      </Button>
    </form>
  )
}
