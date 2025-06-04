"use client"

import type React from "react"
import { useState } from "react"
import { Upload, AlertCircle, Smartphone, QrCode } from "lucide-react"
import { useWallet } from "@/contexts/WalletContext"

export default function Deposit() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [paymentCode, setPaymentCode] = useState("")

  const { wallet, addTransaction } = useWallet()

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    setIsLoading(true)

    try {
      if (!wallet.isConnected) {
        throw new Error("Please connect your wallet first")
      }

      if (!phoneNumber || !amount) {
        throw new Error("Please fill in all fields")
      }

      // Simulate API call to deposit service
      const response = await fetch("/api/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, amount, walletAddress: wallet.address }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Deposit failed")
      }

      setPaymentCode(data.paymentCode)
      addTransaction({
        type: "deposit",
        amount: data.ethAmount,
        status: "pending",
      })

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Deposit failed")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setPhoneNumber("")
    setAmount("")
    setPaymentCode("")
    setSuccess(false)
    setError("")
  }

  if (success && paymentCode) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-amber-200 dark:border-slate-700">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <QrCode className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Complete Payment</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              Use this code to complete your M-Pesa payment
            </p>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-6">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Payment Code</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 tracking-wider">{paymentCode}</p>
            </div>

            <div className="text-left space-y-2 mb-6">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                <strong>1.</strong> Go to M-Pesa menu
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                <strong>2.</strong> Select "Lipa na M-Pesa"
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                <strong>3.</strong> Enter Business Number: <strong>174379</strong>
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                <strong>4.</strong> Enter Account: <strong>{paymentCode}</strong>
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                <strong>5.</strong> Enter Amount: <strong>KES {amount}</strong>
              </p>
            </div>

            <button
              onClick={resetForm}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:from-amber-600 hover:to-orange-600 transition-all"
            >
              Make Another Deposit
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-amber-200 dark:border-slate-700">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <Upload className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Deposit with M-Pesa</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">Convert KES to ETH instantly</p>
          </div>
        </div>

        <form onSubmit={handleDeposit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              M-Pesa Phone Number
            </label>
            <div className="relative">
              <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+254 7XX XXX XXX"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Amount (KES)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1000"
              min="100"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <p className="text-sm text-blue-700 dark:text-blue-400">
              <strong>Exchange Rate:</strong> 1 ETH ≈ 450,000 KES
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
              <strong>You'll receive:</strong> {amount ? (Number.parseFloat(amount) / 450000).toFixed(6) : "0"} ETH
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
              <strong>Fee:</strong> 1.5%
            </p>
          </div>

          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-sm text-red-700 dark:text-red-400">{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !wallet.isConnected}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? "Processing..." : "Generate Payment Code"}
          </button>
        </form>
      </div>
    </div>
  )
}
