"use client"

import type React from "react"
import { useState } from "react"
import { Phone, AlertCircle, CheckCircle, Smartphone } from "lucide-react"
import { useWallet } from "@/contexts/WalletContext"
import type { MobileNetwork, AirtimePackage } from "@/types"

const networks: MobileNetwork[] = [
  { id: "safaricom", name: "Safaricom", logo: "🟢", country: "Kenya" },
  { id: "airtel", name: "Airtel", logo: "🔴", country: "Kenya" },
  { id: "telkom", name: "Telkom", logo: "🔵", country: "Kenya" },
]

const airtimePackages: AirtimePackage[] = [
  { amount: 50, validity: "1 day" },
  { amount: 100, validity: "3 days" },
  { amount: 250, validity: "7 days" },
  { amount: 500, validity: "30 days", bonus: "+50 KES bonus" },
  { amount: 1000, validity: "30 days", bonus: "+200 KES bonus" },
]

export default function Airtime() {
  const [selectedNetwork, setSelectedNetwork] = useState<string>("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [selectedPackage, setSelectedPackage] = useState<AirtimePackage | null>(null)
  const [customAmount, setCustomAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const { wallet, addTransaction } = useWallet()

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    setIsLoading(true)

    try {
      if (!wallet.isConnected) {
        throw new Error("Please connect your wallet first")
      }

      if (!selectedNetwork || !phoneNumber) {
        throw new Error("Please select network and enter phone number")
      }

      const amount = selectedPackage ? selectedPackage.amount : Number.parseFloat(customAmount)
      if (!amount || amount < 10) {
        throw new Error("Please select a package or enter a valid amount (min 10 KES)")
      }

      // Calculate ETH equivalent (1 ETH ≈ 450,000 KES)
      const ethAmount = (amount / 450000).toFixed(6)

      if (Number.parseFloat(ethAmount) > Number.parseFloat(wallet.balance)) {
        throw new Error("Insufficient ETH balance")
      }

      // Simulate API call to airtime service
      const response = await fetch("/api/airtime", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          network: selectedNetwork,
          phoneNumber,
          amount,
          walletAddress: wallet.address,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Airtime purchase failed")
      }

      addTransaction({
        type: "airtime",
        amount: ethAmount,
        status: "completed",
      })

      setSuccess(true)
      setPhoneNumber("")
      setSelectedPackage(null)
      setCustomAmount("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Purchase failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-amber-200 dark:border-slate-700">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
            <Phone className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Buy Airtime</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">Pay with ETH instantly</p>
          </div>
        </div>

        <form onSubmit={handlePurchase} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Mobile Network</label>
            <div className="grid grid-cols-3 gap-2">
              {networks.map((network) => (
                <button
                  key={network.id}
                  type="button"
                  onClick={() => setSelectedNetwork(network.id)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    selectedNetwork === network.id
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                      : "border-slate-300 dark:border-slate-600 hover:border-purple-300"
                  }`}
                >
                  <div className="text-2xl mb-1">{network.logo}</div>
                  <div className="text-xs font-medium text-slate-700 dark:text-slate-300">{network.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Phone Number</label>
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
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Airtime Package</label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {airtimePackages.map((pkg, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setSelectedPackage(pkg)
                    setCustomAmount("")
                  }}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    selectedPackage === pkg
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                      : "border-slate-300 dark:border-slate-600 hover:border-purple-300"
                  }`}
                >
                  <div className="font-medium text-slate-800 dark:text-white">KES {pkg.amount}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">{pkg.validity}</div>
                  {pkg.bonus && (
                    <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">{pkg.bonus}</div>
                  )}
                </button>
              ))}
            </div>

            <div className="relative">
              <input
                type="number"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value)
                  setSelectedPackage(null)
                }}
                placeholder="Custom amount (KES)"
                min="10"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>

          {(selectedPackage || customAmount) && (
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
              <p className="text-sm text-purple-700 dark:text-purple-400">
                <strong>Amount:</strong> KES {selectedPackage ? selectedPackage.amount : customAmount}
              </p>
              <p className="text-sm text-purple-700 dark:text-purple-400">
                <strong>ETH Cost:</strong>{" "}
                {selectedPackage
                  ? (selectedPackage.amount / 450000).toFixed(6)
                  : customAmount
                    ? (Number.parseFloat(customAmount) / 450000).toFixed(6)
                    : "0"}{" "}
                ETH
              </p>
            </div>
          )}

          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-sm text-red-700 dark:text-red-400">{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-green-700 dark:text-green-400">Airtime purchased successfully!</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !wallet.isConnected}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? "Processing..." : "Buy Airtime"}
          </button>
        </form>
      </div>
    </div>
  )
}
