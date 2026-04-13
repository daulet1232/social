'use client'

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const login = async () => {
    await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/feed"
    })
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">

      <Card className="w-[360px] shadow-xl">
        
        <CardHeader>
          <CardTitle className="text-center text-xl">
            Welcome back
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">

          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button className="w-full" onClick={login}>
            Sign in
          </Button>

          <p
            className="text-center text-sm text-gray-500 cursor-pointer"
            onClick={() => router.push('/register')}
          >
            No account? Sign up
          </p>

        </CardContent>
      </Card>

    </div>
  )
}