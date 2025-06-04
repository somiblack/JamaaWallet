"use client"
import {
  User,
  Wallet,
  History,
  ExternalLink,
  Copy,
  MessageCircle,
  Phone,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react"
import { useWallet } from "@/contexts/WalletContext"

export default function Account() {
  const { wallet, transactions } = useWallet()

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "pending":
        return <Clock className="w-4 h-4 text-amber-500" />
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-slate-400" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "send":
        return "text-red-600 dark:text-red-400"
      case "receive":
        return "text-green-600 dark:text-green-400"
      case "withdraw":
        return "text-blue-600 dark:text-blue-400"
      case "deposit":
        return "text-purple-600 dark:text-purple-400"
      case "airtime":
        return "text-pink-600 dark:text-pink-400"
      case "savings":
        return "text-emerald-600 dark:text-emerald-400"
      default:
        return "text-slate-600 dark:text-slate-400"
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Account Overview */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-amber-200 dark:border-slate-700">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">My Account</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">Manage your JamaaWallet account</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">Wallet Address</span>
                <Wallet className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-mono text-slate-800 dark:text-white">
                  {wallet.address ? `${wallet.address.slice(0, 10)}...${wallet.address.slice(-8)}` : "Not connected"}
                </span>
                {wallet.address && (
                  <button
                    onClick={() => copyToClipboard(wallet.address!)}
                    className="p-1 hover:bg-indigo-100 dark:hover:bg-indigo-800 rounded"
                  >
                    <Copy className="w-3 h-3 text-indigo-500" />
                  </button>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">ETH Balance</span>
                <Wallet className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                {Number.parseFloat(wallet.balance).toFixed(4)} ETH
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Quick Access</h3>

            <div className="space-y-3">
              <a
                href="https://t.me/jamaawallet_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all"
              >
                <div className="flex items-center space-x-3">
                  <MessageCircle className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className="font-medium text-slate-800 dark:text-white">Telegram Bot</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Quick transactions via chat</div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-blue-500" />
              </a>

              <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-amber-500" />
                  <div>
                    <div className="font-medium text-slate-800 dark:text-white">USSD Access</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">*384*7# (Coming Soon)</div>
                  </div>
                </div>
                <span className="text-xs bg-amber-200 dark:bg-amber-800 text-amber-700 dark:text-amber-300 px-2 py-1 rounded-full">
                  Soon
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-amber-200 dark:border-slate-700">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl flex items-center justify-center">
            <History className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Transaction History</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Your recent activity</p>
          </div>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <History className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-600 dark:text-slate-400">No transactions yet</p>
            <p className="text-sm text-slate-500 dark:text-slate-500">Your transaction history will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.slice(0, 10).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-xl"
              >
                <div className="flex items-center space-x-3">
                  {getStatusIcon(transaction.status)}
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-slate-800 dark:text-white capitalize">{transaction.type}</span>
                      <span className={`text-sm font-medium ${getTypeColor(transaction.type)}`}>
                        {transaction.type === "send" ? "-" : "+"}
                        {transaction.amount} ETH
                      </span>
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {transaction.timestamp.toLocaleDateString()} {transaction.timestamp.toLocaleTimeString()}
                    </div>
                    {transaction.recipient && (
                      <div className="text-xs text-slate-500 dark:text-slate-500 font-mono">
                        To: {transaction.recipient.slice(0, 10)}...{transaction.recipient.slice(-8)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-sm font-medium capitalize ${
                      transaction.status === "completed"
                        ? "text-green-600 dark:text-green-400"
                        : transaction.status === "pending"
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {transaction.status}
                  </div>
                  {transaction.hash && (
                    <button
                      onClick={() => copyToClipboard(transaction.hash!)}
                      className="text-xs text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center space-x-1"
                    >
                      <span>Copy Hash</span>
                      <Copy className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
