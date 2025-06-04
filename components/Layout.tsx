"use client"

import type React from "react"
import { useState } from "react"
import { Wallet, Send, Download, Upload, Phone, PiggyBank, User, Menu, X, Sun, Moon } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"
import { useWallet } from "@/contexts/WalletContext"

interface LayoutProps {
  children: React.ReactNode
  activeTab: string
  onTabChange: (tab: string) => void
}

const tabs = [
  { id: "send", label: "Send", icon: Send },
  { id: "withdraw", label: "Withdraw", icon: Download },
  { id: "deposit", label: "Deposit", icon: Upload },
  { id: "airtime", label: "Airtime", icon: Phone },
  { id: "savings", label: "Savings", icon: PiggyBank },
  { id: "account", label: "Account", icon: User },
]

export default function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { wallet, connectWallet } = useWallet()

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-amber-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                JamaaWallet
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
                      activeTab === tab.id
                        ? "bg-amber-100 dark:bg-slate-700 text-amber-700 dark:text-amber-300"
                        : "text-slate-600 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-700"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                )
              })}
            </nav>

            {/* Right side controls */}
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-amber-100 dark:bg-slate-700 text-amber-700 dark:text-amber-300"
              >
                {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>

              {!wallet.isConnected ? (
                <button
                  onClick={connectWallet}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all"
                >
                  Connect Wallet
                </button>
              ) : (
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg bg-amber-100 dark:bg-slate-700 text-amber-700 dark:text-amber-300"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-800 border-t border-amber-200 dark:border-slate-700">
            <div className="px-4 py-2 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      onTabChange(tab.id)
                      setIsMobileMenuOpen(false)
                    }}
                    className={`w-full px-4 py-3 rounded-lg flex items-center space-x-3 transition-all ${
                      activeTab === tab.id
                        ? "bg-amber-100 dark:bg-slate-700 text-amber-700 dark:text-amber-300"
                        : "text-slate-600 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-700"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  )
}
