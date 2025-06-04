"use client"

import { useState } from "react"
import Layout from "@/components/Layout"
import SendETH from "@/components/SendETH"
import Withdraw from "@/components/Withdraw"
import Deposit from "@/components/Deposit"
import Airtime from "@/components/Airtime"
import Savings from "@/components/Savings"
import Account from "@/components/Account"

export default function Home() {
  const [activeTab, setActiveTab] = useState("send")

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "send":
        return <SendETH />
      case "withdraw":
        return <Withdraw />
      case "deposit":
        return <Deposit />
      case "airtime":
        return <Airtime />
      case "savings":
        return <Savings />
      case "account":
        return <Account />
      default:
        return <SendETH />
    }
  }

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderActiveComponent()}
    </Layout>
  )
}
