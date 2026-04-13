import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { postId } = await req.json()

  const userId = session.user.id

  const existingLike = await prisma.like.findFirst({
    where: {
      postId,
      userId
    }
  })

  // toggle logic
  if (existingLike) {
    await prisma.like.delete({
      where: { id: existingLike.id }
    })

    return Response.json({ liked: false })
  }

  await prisma.like.create({
    data: {
      postId,
      userId
    }
  })

  return Response.json({ liked: true })
}