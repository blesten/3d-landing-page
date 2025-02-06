import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"
import { ReactNode } from "react"

type Props = {
  children: ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}