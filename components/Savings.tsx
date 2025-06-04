"use client"

import type React from "react"
import { useState } from "react"
import { PiggyBank, TrendingUp, Target, Plus, AlertCircle, CheckCircle } from "lucide-react"
import { useWallet } from "@/contexts/WalletContext"

export default function Savings() {
  const [depositAmount, setDepositAmount] = useState("")
  const [newGoal, setNewGoal] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const { wallet, savings, loanEligibility, updateSavings } = useWallet()

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      if (!wallet.isConnected) {
        throw new Error("Please connect your wallet first")
      }

      if (!depositAmount) {
        throw new Error("Please enter deposit amount")
      }

      if (Number.parseFloat(depositAmount) > Number.parseFloat(wallet.balance)) {
        throw new Error("Insufficient balance")
      }

      // Simulate deposit to savings
      updateSavings(depositAmount)
      setSuccess(`Successfully deposited ${depositAmount} ETH to savings!`)
      setDepositAmount("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Deposit failed")
    } finally {
      setIsLoading(false)
    }
  }

  const progressPercentage = (Number.parseFloat(savings.balance) / Number.parseFloat(savings.goal)) * 100

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Savings Overview */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-amber-200 dark:border-slate-700">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
            <PiggyBank className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Savings Account</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">Earn {savings.interestRate}% annual interest</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">Current Balance</span>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {Number.parseFloat(savings.balance).toFixed(4)} ETH
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">Savings Goal</span>
                <Target className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{savings.goal} ETH</div>
              <div className="mt-3">
                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-1">
                  <span>Progress</span>
                  <span>{Math.min(progressPercentage, 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <form onSubmit={handleDeposit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Deposit Amount (ETH)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="0.0"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
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
                  <span className="text-sm text-green-700 dark:text-green-400">{success}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !wallet.isConnected}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>{isLoading ? "Depositing..." : "Deposit to Savings"}</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Loan Eligibility */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-amber-200 dark:border-slate-700">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Loan Eligibility</h3>

        {loanEligibility.eligible ? (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="font-medium text-green-700 dark:text-green-400">You're eligible for a loan!</span>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-600 dark:text-slate-400">Maximum Amount:</span>
                <div className="font-bold text-green-600 dark:text-green-400">
                  {Number.parseFloat(loanEligibility.maxAmount).toFixed(4)} ETH
                </div>
              </div>
              <div>
                <span className="text-slate-600 dark:text-slate-400">Interest Rate:</span>
                <div className="font-bold text-green-600 dark:text-green-400">
                  {loanEligibility.interestRate}% per year
                </div>
              </div>
            </div>
            <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all">
              Apply for Loan
            </button>
          </div>
        ) : (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <span className="font-medium text-amber-700 dark:text-amber-400">Not eligible yet</span>
            </div>
            <p className="text-sm text-amber-700 dark:text-amber-400">
              Build your savings history by depositing at least 0.1 ETH to become eligible for loans.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
