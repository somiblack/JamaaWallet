export interface WalletState {
  address: string | null
  balance: string
  isConnected: boolean
  chainId: number | null
}

export interface Transaction {
  id: string
  type: "send" | "receive" | "withdraw" | "deposit" | "airtime" | "savings"
  amount: string
  recipient?: string
  timestamp: Date
  status: "pending" | "completed" | "failed"
  hash?: string
}

export interface SavingsAccount {
  balance: string
  goal: string
  interestRate: number
  lastDeposit?: Date
}

export interface LoanEligibility {
  eligible: boolean
  maxAmount: string
  interestRate: number
  reason?: string
}

export interface MobileNetwork {
  id: string
  name: string
  logo: string
  country: string
}

export interface AirtimePackage {
  amount: number
  bonus?: string
  validity: string
}
