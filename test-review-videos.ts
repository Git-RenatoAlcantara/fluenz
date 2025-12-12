import db from "./prisma/prisma"

async function testReviewVideos() {
  console.log('🔍 Testando vídeos para revisão...\n')

  // Buscar todos os vídeos assistidos
  const watchedVideos = await db.video.findMany({
    where: {
      last_view_at: { not: null }
    },
    select: {
      id: true,
      title: true,
      last_view_at: true,
      nextReviewDate: true,
      repetitionInterval: true,
      repetitionEase: true,
      reviewCount: true,
      userId: true
    }
  })

  console.log(`📊 Total de vídeos assistidos: ${watchedVideos.length}\n`)

  const today = new Date()
  today.setHours(23, 59, 59, 999)
  
  console.log(`📅 Data de hoje (fim do dia): ${today}\n`)

  watchedVideos.forEach((video, index) => {
    console.log(`\n--- Vídeo ${index + 1} ---`)
    console.log(`ID: ${video.id}`)
    console.log(`Título: ${video.title || 'Sem título'}`)
    console.log(`Usuário ID: ${video.userId}`)
    console.log(`Assistido em: ${video.last_view_at}`)
    console.log(`nextReviewDate: ${video.nextReviewDate}`)
    console.log(`repetitionInterval: ${video.repetitionInterval}`)
    console.log(`repetitionEase: ${video.repetitionEase}`)
    console.log(`reviewCount: ${video.reviewCount}`)
    
    if (video.nextReviewDate) {
      const isEligible = video.nextReviewDate <= today
      console.log(`✅ Elegível para revisão hoje? ${isEligible ? 'SIM' : 'NÃO'}`)
      if (!isEligible) {
        console.log(`   (Agendado para: ${video.nextReviewDate})`)
      }
    } else {
      console.log(`❌ nextReviewDate é NULL - não vai aparecer para revisão`)
    }
  })

  console.log('\n\n🔍 Vídeos que DEVERIAM aparecer para revisão hoje:')
  const eligibleVideos = watchedVideos.filter(v => v.nextReviewDate && v.nextReviewDate <= today)
  console.log(`Total: ${eligibleVideos.length}`)
  eligibleVideos.forEach(v => {
    console.log(`  - ${v.title || 'Sem título'} (ID: ${v.id}, User: ${v.userId})`)
  })

  await db.$disconnect()
}

testReviewVideos().catch(console.error)
