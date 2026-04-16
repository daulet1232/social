import { prisma } from '@/lib/prisma'
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/auth-options"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    const comment = await prisma.comment.create({
      data: {
        content: body.content,
        postId: body.postId,
        userId: session.user.id   
      },
      include: {
        user: true  
      }
    })

    return Response.json(comment)

  } catch (e) {
    console.error('COMMENT ERROR:', e)

    return new Response(
      JSON.stringify({ error: 'fail' }),
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id) {
    return Response.json({ error: "No id" }, { status: 400 })
  }

  const comment = await prisma.comment.findUnique({
    where: { id },
    include: { post: true }
  })

  if (!comment) {
    return Response.json({ error: "Not found" }, { status: 404 })
  }

  // 🔥 ПРАВА:
  const isCommentOwner = comment.userId === session.user.id
  const isPostOwner = comment.post.authorId === session.user.id

  if (!isCommentOwner && !isPostOwner) {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  await prisma.comment.delete({
    where: { id }
  })

  return Response.json({ success: true })
}