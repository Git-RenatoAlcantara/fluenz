import { Suspense } from "react"
import SkillTreeClient from "./pageClient"

export default function SkillTreePage() {
  return (
    <Suspense fallback={<div>Carregando Skill Tree...</div>}>
      <SkillTreeClient />
    </Suspense>
  )
}
