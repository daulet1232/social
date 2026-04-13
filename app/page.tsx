'use client'

import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function HomePage() {
  const { status } = useSession()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (status === "authenticated") {
      router.push('/feed')
    }
  }, [status])

  const login = async () => {
    await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/feed"
    })
  }

  return (
    <div style={{ textAlign: "center", marginTop: 100 }}>
      <h1>Login</h1>

      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={login}>
        Войти
      </button>

      <p
        style={{ marginTop: 20, cursor: "pointer" }}
        onClick={() => router.push('/register')}
      >
        Нет аккаунта? Регистрация
      </p>
    </div>
  )
}