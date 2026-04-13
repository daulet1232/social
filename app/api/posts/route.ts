import { prisma } from '@/lib/prisma'
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/auth-options"

// ✅ GET — чтобы видеть посты в браузере
export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: true, likes: true, comments: true }
  })

  return Response.json(posts)
}

// ✅ POST — чтобы создавать посты из формы
export async function POST(req: Request) {
  console.log("POST HIT")

  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    console.log("BODY:", body)

    const post = await prisma.post.create({
      data: {
        content: body.content,
        image: body.image || null,
        authorId: session.user.id // 🔥 ВОТ ГЛАВНОЕ
      }
    })

    console.log("CREATED:", post)

    return Response.json(post)

  } catch (e) {
    console.error("ERROR:", e)

    return new Response(
      JSON.stringify({ error: "fail" }),
      { status: 500 }
    )
  }
}


export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) {
    return Response.json({ error: 'no id' }, { status: 400 })
  }

  await prisma.post.delete({
    where: { id }
  })

  return Response.json({ success: true })
}

export async function PUT(req: Request) {
  const body = await req.json()

  const post = await prisma.post.update({
    where: { id: body.id },
    data: {
      content: body.content,
      image: body.image
    }
  })

  return Response.json(post)
}


