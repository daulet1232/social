import { prisma } from '@/lib/prisma'

export async function GET() {
  const user = await prisma.user.create({
    data: {
      email: "test@test.com"
    }
  })

  return Response.json(user)
}