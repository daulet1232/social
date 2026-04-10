import { prisma } from '@/lib/prisma'

// ✅ GET — чтобы видеть посты в браузере
export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: true }
  })

  return Response.json(posts)
}

// ✅ POST — твой рабочий код (можешь оставить с логами)
export async function POST(req: Request) {
  console.log("POST HIT")

  try {
    const body = await req.json()
    console.log("BODY:", body)

    const post = await prisma.post.create({
      data: {
        content: body.content,
        authorId: body.authorId
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