import { prisma } from '@/lib/prisma'

const DEMO_USER_ID = 'daulet'

export async function POST(req: Request) {
  const { postId } = await req.json()

  // 🔍 проверяем есть ли лайк
  const existing = await prisma.like.findUnique({
    where: {
      postId_userId: {
        postId,
        userId: DEMO_USER_ID
      }
    }
  })

  if (existing) {
    // ❌ убрать лайк
    await prisma.like.delete({
      where: {
        postId_userId: {
          postId,
          userId: DEMO_USER_ID
        }
      }
    })

    return Response.json({ liked: false })
  }

  // ✅ поставить лайк
  await prisma.like.create({
    data: {
      postId,
      userId: DEMO_USER_ID
    }
  })

  return Response.json({ liked: true })
}