import { Suspense } from "react"
import GuildClient from "./pageClient"

export default function GuildPage() {
  return (
    <Suspense fallback={<div>Carregando Guildas...</div>}>
      <GuildClient />
    </Suspense>
  )
}
