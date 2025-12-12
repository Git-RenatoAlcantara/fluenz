import { Suspense } from "react"
import ShopClient from "./pageClient"

export default function ShopPage() {
  return (
    <Suspense fallback={<div>Carregando loja...</div>}>
      <ShopClient />
    </Suspense>
  )
}
