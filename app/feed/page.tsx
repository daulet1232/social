'use client'

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

import PostEditor from "@/components/feed/PostEditor"
import PostCard from "@/components/feed/PostCard"
import { Post } from "@/types/post"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const { status } = useSession()
  const router = useRouter()

  const fetchPosts = async () => {
    const res = await fetch("/api/posts")
    const data = await res.json()
    setPosts(data)
  }

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/posts')
      const data = await res.json()
      setPosts(data)
    }

    load()
  }, [])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [status])

  if (status === "loading") return <p>Loading...</p>

  return (
  <div className="min-h-screen bg-gray-100">

    {/* 🔥 HEADER */}
    <div className="max-w-2xl mx-auto pt-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Feed</h1>

      <Button
        variant="destructive"
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        Logout
      </Button>
    </div>

    {/* CREATE POST */}
    <div className="mt-6">
      <PostEditor onPostCreated={fetchPosts} />
    </div>

    {/* POSTS */}
    <div className="max-w-2xl mx-auto mt-6 space-y-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onChange={fetchPosts}
        />
      ))}
    </div>

  </div>
)
}