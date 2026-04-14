'use client'

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

type Props = {
  onPostCreated: () => void
}

export default function PostEditor({ onPostCreated }: Props) {
  const [content, setContent] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const fileRef = useRef<HTMLInputElement>(null)

  const createPost = async () => {
    if (!content.trim() && !image) return

    let imageUrl = ""

    if (image) {
      const formData = new FormData()
      formData.append("file", image)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      })

      const data = await res.json()
      imageUrl = data.url
    }

    await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content,
        image: imageUrl
      })
    })

    setContent("")
    setImage(null)
    setPreview(null)

    onPostCreated()
  }

  return (
    <Card className="max-w-2xl mx-auto mt-6">
      <CardContent className="p-4 space-y-3">

        <Input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Напиши пост..."
        />

        <input
          ref={fileRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              setImage(file)
              setPreview(URL.createObjectURL(file))
            }
          }}
        />

        {preview && (
          <img src={preview} className="w-32 rounded-lg" />
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => fileRef.current?.click()}
          >
            📎 Attach
          </Button>

          <Button onClick={createPost} className="flex-1">
            Post
          </Button>
        </div>

      </CardContent>
    </Card>
  )
}