'use client'

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import CommentSection from "./CommentSection"
import { Post } from "@/types/post"



type Props = {
  post: Post
  onChange: () => void
}

export default function PostCard({ post, onChange }: Props) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(post.content)

  const [editImage, setEditImage] = useState<File | null>(null)
  const [editPreview, setEditPreview] = useState<string | null>(post.image)

  const editFileRef = useRef<HTMLInputElement>(null)
  const editInputRef = useRef<HTMLInputElement>(null)

  const like = async () => {
    await fetch("/api/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId: post.id })
    })

    onChange()
  }

  const remove = async () => {
    await fetch(`/api/posts?id=${post.id}`, {
      method: "DELETE"
    })

    onChange()
  }

  const saveEdit = async () => {
    await fetch("/api/posts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: post.id,
        content: text
      })
    })

    setEditing(false)
    onChange()
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow">

      {editing ? (
  <div className="space-y-3">

    <Input
      ref={editInputRef}
      value={text}
      onChange={(e) => setText(e.target.value)}
    />

    {/* hidden file input */}
    <input
      ref={editFileRef}
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(e) => {
        const file = e.target.files?.[0]
        if (file) {
          setEditImage(file)
          setEditPreview(URL.createObjectURL(file))
        }
      }}
    />

    {/* preview */}
    {editPreview && (
  <div className="relative w-fit">
    
    <img
      src={editPreview}
      className="w-32 rounded-lg"
    />

    {/* ❌ КНОПКА УДАЛЕНИЯ */}
    <button
      onClick={() => {
        setEditPreview(null)
        setEditImage(null)
      }}
      className="absolute top-1 right-1 bg-black/70 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center hover:bg-black"
    >
      ✕
    </button>

  </div>
)}

    {/* actions */}
    <div className="flex gap-2">

      {/* 📎 КНОПКА */}
      <Button
        variant="outline"
        onClick={() => editFileRef.current?.click()}
      >
        📎 Attach
      </Button>

      <Button
        onClick={async () => {
          let imageUrl = editPreview || ''

          if (editImage) {
            const formData = new FormData()
            formData.append('file', editImage)

            const res = await fetch('/api/upload', {
              method: 'POST',
              body: formData
            })

            const data = await res.json()
            imageUrl = data.url
          }

          await fetch('/api/posts', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: post.id,
              content: text,
              image: imageUrl
            })
          })

          setEditing(false)
          setEditImage(null)
          setEditPreview(null)
          onChange()
        }}
      >
        Save
      </Button>

      <Button
        variant="secondary"
        onClick={() => {
          setEditing(false)
          setEditImage(null)
          setEditPreview(null)
        }}
      >
        Cancel
      </Button>

    </div>
  </div>
) : (
        <>
          <p>{post.content}</p>

          {post.image && (
            <img src={post.image} className="rounded-lg mt-2" />
          )}

          <p className="text-xs text-gray-400 mt-2">
            {post.author?.email}
          </p>

          <div className="flex gap-2 mt-3">
            <Button variant="destructive" onClick={remove}>
              Delete
            </Button>

            <Button variant="secondary" onClick={() => setEditing(true)}>
              Edit
            </Button>

            <Button variant="outline" onClick={like}>
              ❤️ {post.likes?.length ?? 0}
            </Button>
          </div>

          <CommentSection post={post} onChange={onChange} />
        </>
      )}

    </div>
  )
}