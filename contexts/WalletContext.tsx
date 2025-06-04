"use client"

import type React from "react"
import { createContext, useContext, useReducer } from "react"
import { ethers } from "ethers"
import type { WalletState, Transaction, SavingsAccount, LoanEligibility } from "@/types"

interface WalletContextType {
  wallet: WalletState
  transactions: Transaction[]
  savings: SavingsAccount
  loanEligibility: LoanEligibility
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  sendETH: (recipient: string, amount: string) => Promise<void>
  addTransaction: (transaction: Omit<Transaction, "id" | "timestamp">) => void
  updateSavings: (amount: string) => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

type WalletAction =
  | { type: "CONNECT_WALLET"; payload: { address: string; balance: string; chainId: number } }
  | { type: "DISCONNECT_WALLET" }
  | { type: "UPDATE_BALANCE"; payload: string }
  | { type: "ADD_TRANSACTION"; payload: Transaction }
  | { type: "UPDATE_SAVINGS"; payload: string }

const initialState = {
  wallet: {
    address: null,
    balance: "0",
    isConnected: false,
    chainId: null,
  },
  transactions: [] as Transaction[],
  savings: {
    balance: "0",
    goal: "1000",
    interestRate: 5.5,
  },
  loanEligibility: {
    eligible: false,
    maxAmount: "0",
    interestRate: 12,
  },
}

function walletReducer(state: typeof initialState, action: WalletAction) {
  switch (action.type) {
    case "CONNECT_WALLET":
      return {
        ...state,
        wallet: {
          ...action.payload,
          isConnected: true,
        },
      }
    case "DISCONNECT_WALLET":
      return {
        ...state,
        wallet: initialState.wallet,
      }
    case "UPDATE_BALANCE":
      return {
        ...state,
        wallet: {
          ...state.wallet,
          balance: action.payload,
        },
      }
    case "ADD_TRANSACTION":
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      }
    case "UPDATE_SAVINGS":
      const newSavingsBalance = (
        Number.parseFloat(state.savings.balance) + Number.parseFloat(action.payload)
      ).toString()
      return {
        ...state,
        savings: {
          ...state.savings,
          balance: newSavingsBalance,
          lastDeposit: new Date(),
        },
        loanEligibility: {
          eligible: Number.parseFloat(newSavingsBalance) > 100,
          maxAmount: (Number.parseFloat(newSavingsBalance) * 2).toString(),
          interestRate: 12,
        },
      }
    default:
      return state
  }
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(walletReducer, initialState)

  const connectWallet = async () => {
    try {
      if (typeof window !== "undefined" && window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const accounts = await provider.send("eth_requestAccounts", [])
        const signer = await provider.getSigner()
        const address = await signer.getAddress()
        const balance = await provider.getBalance(address)
        const network = await provider.getNetwork()

        dispatch({
          type: "CONNECT_WALLET",
          payload: {
            address,
            balance: ethers.formatEther(balance),
            chainId: Number(network.chainId),
          },
        })
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    }
  }

  const disconnectWallet = () => {
    dispatch({ type: "DISCONNECT_WALLET" })
  }

  const sendETH = async (recipient: string, amount: string) => {
    try {
      if (typeof window !== "undefined" && window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()

        const tx = await signer.sendTransaction({
          to: recipient,
          value: ethers.parseEther(amount),
        })

        addTransaction({
          type: "send",
          amount,
          recipient,
          status: "pending",
          hash: tx.hash,
        })

        await tx.wait()

        // Update balance after transaction
        const newBalance = await provider.getBalance(await signer.getAddress())
        dispatch({ type: "UPDATE_BALANCE", payload: ethers.formatEther(newBalance) })
      }
    } catch (error) {
      console.error("Failed to send ETH:", error)
    }
  }

  const addTransaction = (transaction: Omit<Transaction, "id" | "timestamp">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    }
    dispatch({ type: "ADD_TRANSACTION", payload: newTransaction })
  }

  const updateSavings = (amount: string) => {
    dispatch({ type: "UPDATE_SAVINGS", payload: amount })
  }

  return (
    <WalletContext.Provider
      value={{
        wallet: state.wallet,
        transactions: state.transactions,
        savings: state.savings,
        loanEligibility: state.loanEligibility,
        connectWallet,
        disconnectWallet,
        sendETH,
        addTransaction,
        updateSavings,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
