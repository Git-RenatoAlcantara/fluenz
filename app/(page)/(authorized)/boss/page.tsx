import { Suspense } from "react"
import BossBattleClient from "./pageClient"

export default function BossBattlePage() {
  return (
    <Suspense fallback={<div>Carregando Boss Battle...</div>}>
      <BossBattleClient />
    </Suspense>
  )
}
