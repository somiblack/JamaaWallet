import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, amount, walletAddress } = await request.json()

    // Validate input
    if (!phoneNumber || !amount || !walletAddress) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Generate payment code for M-Pesa
    const paymentCode = Math.random().toString(36).substr(2, 8).toUpperCase()
    const ethAmount = Number.parseFloat(amount) / 450000 // KES to ETH conversion

    // In a real implementation, this would:
    // 1. Create a payment request in M-Pesa
    // 2. Store the payment code in database
    // 3. Set up webhook to listen for payment confirmation

    return NextResponse.json({
      success: true,
      paymentCode,
      ethAmount: ethAmount.toFixed(6),
      kesAmount: amount,
      message: "Payment code generated successfully",
    })
  } catch (error) {
    console.error("Deposit error:", error)
    return NextResponse.json({ error: "Deposit failed" }, { status: 500 })
  }
}
