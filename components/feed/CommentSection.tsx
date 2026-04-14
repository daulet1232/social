'use client'

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Post } from "@/types/post"



type Props = {
  post: Post
  onChange: () => void
}

export default function CommentSection({ post, onChange }: Props) {
  const [text, setText] = useState("")

  const send = async () => {
    if (!text.trim()) return

    await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postId: post.id,
        content: text
      })
    })

    setText("")
    onChange()
  }

  return (
    <div className="mt-3 space-y-2">

      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Комментарий..."
      />

      <Button size="sm" onClick={send}>
        Send
      </Button>

      <div className="space-y-1">
        {post.comments?.map((c) => (
          <p key={c.id} className="text-sm text-gray-600">
            💬 {c.content}
          </p>
        ))}
      </div>

    </div>
  )
}