import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const comment = await prisma.comment.create({
      data: {
        content: body.content,
        postId: body.postId
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