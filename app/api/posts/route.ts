import { prisma } from '@/lib/prisma'
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/auth-options"

// ✅ GET — чтобы видеть посты в браузере
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: true,
        likes: true,
        comments: {
          include: {
            user: true
          }
        }
      }
    })

    return Response.json(posts)
  } catch (e) {
    console.error("🔥 POSTS API ERROR:", e)

    return Response.json(
      { error: "POSTS FAILED" },
      { status: 500 }
    )
  }
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
        authorId: session.user.id //  ВОТ ГЛАВНОЕ
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
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id) {
    return Response.json({ error: "No id" }, { status: 400 })
  }

  const post = await prisma.post.findUnique({
    where: { id }
  })

  if (!post) {
    return Response.json({ error: "Not found" }, { status: 404 })
  }

  // ВАЖНАЯ ПРОВЕРКА ВЛАДЕЛЬЦА
  if (post.authorId !== session.user.id) {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  await prisma.post.delete({
    where: { id }
  })

  return Response.json({ success: true })
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { id, content, image } = body

    const post = await prisma.post.findUnique({
      where: { id }
    })

    if (!post) {
      return Response.json({ error: "Not found" }, { status: 404 })
    }

    //  ВАЖНАЯ ПРОВЕРКА ВЛАДЕЛЬЦА
    if (post.authorId !== session.user.id) {
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }

    const updated = await prisma.post.update({
      where: { id },
      data: {
        content,
        image
      }
    })

    return Response.json(updated)

  } catch (e) {
    console.error("PUT ERROR:", e)

    return new Response(
      JSON.stringify({ error: "fail" }),
      { status: 500 }
    )
  }
}


