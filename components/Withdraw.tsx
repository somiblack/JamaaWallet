"use client"

import type React from "react"
import { useState } from "react"
import { Download, AlertCircle, CheckCircle, Smartphone } from "lucide-react"
import { useWallet } from "@/contexts/WalletContext"

export default function Withdraw() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const { wallet, addTransaction } = useWallet()

  const handleWithdraw = async (e: React.FormEvent) => {
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

      if (Number.parseFloat(amount) > Number.parseFloat(wallet.balance)) {
        throw new Error("Insufficient balance")
      }

      // Simulate API call to withdraw service
      const response = await fetch("/api/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, amount, walletAddress: wallet.address }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Withdrawal failed")
      }

      addTransaction({
        type: "withdraw",
        amount,
        status: "completed",
      })

      setSuccess(true)
      setPhoneNumber("")
      setAmount("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Withdrawal failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-amber-200 dark:border-slate-700">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <Download className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Withdraw to M-Pesa</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Balance: {Number.parseFloat(wallet.balance).toFixed(4)} ETH
            </p>
          </div>
        </div>

        <form onSubmit={handleWithdraw} className="space-y-4">
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
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Amount (ETH)</label>
            <input
              type="number"
              step="0.0001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
            <p className="text-sm text-amber-700 dark:text-amber-400">
              <strong>Exchange Rate:</strong> 1 ETH ≈ 450,000 KES
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
              <strong>Fee:</strong> 2% + Network fees
            </p>
          </div>

          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-sm text-red-700 dark:text-red-400">{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-green-700 dark:text-green-400">
                Withdrawal initiated! Check your M-Pesa.
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !wallet.isConnected}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? "Processing..." : "Withdraw to M-Pesa"}
          </button>
        </form>
      </div>
    </div>
  )
}
