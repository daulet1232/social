'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function RegisterPage() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const register = async () => {
    await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    })

    router.push('/')
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">

      <Card className="w-[360px] shadow-xl">

        <CardHeader>
          <CardTitle className="text-center text-xl">
            Create account
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">

          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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

          <Button className="w-full" onClick={register}>
            Create account
          </Button>

          <p
            className="text-center text-sm text-gray-500 cursor-pointer"
            onClick={() => router.push('/')}
          >
            Already have an account? Sign in
          </p>

        </CardContent>
      </Card>

    </div>
  )
}