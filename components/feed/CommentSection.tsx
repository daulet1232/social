'use client'

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { Comment, Post } from "@/types/post"

type Props = {
  post: Post
  onChange: () => void
}

export default function CommentSection({ post, onChange }: Props) {
  const [text, setText] = useState("")
  const { data: session } = useSession()

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

  const removeComment = async (id: string) => {
    await fetch(`/api/comments?id=${id}`, {
      method: "DELETE"
    })

    onChange()
  }

  return (
    <div className="mt-3 space-y-3">

      {/* INPUT */}
      <div className="flex gap-2">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Комментарий..."
        />

        <Button size="sm" onClick={send}>
          Send
        </Button>
      </div>

      {/* COMMENTS LIST */}
      <div className="space-y-2">
        {post.comments?.map((c: Comment) => (
          <div
            key={c.id}
            className="flex justify-between items-start bg-gray-50 p-2 rounded"
          >
            {/* LEFT SIDE */}
            <div className="text-sm">
              <p className="font-semibold text-gray-700">
                {c.user?.email}
              </p>

              <p className="text-gray-600">
                💬 {c.content}
              </p>


            </div>

            {/* DELETE BUTTON */}
            {(session?.user?.id === c.userId ||
              session?.user?.id === post.authorId) && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => removeComment(c.id)}
              >
                Delete
              </Button>
            )}
          </div>
        ))}
      </div>

    </div>
  )
}