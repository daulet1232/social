'use client'
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
type Post = {
  id: string
  content: string
  createdAt: string
  image: string | null
  author: {
    email: string
  }
  likes: {
    id: string
    postId: string
  }[]
  comments: {
    id: string
    content: string
  }[]
}



export default function FeedPage() {

    
  const [posts, setPosts] = useState<Post[]>([])
  const [content, setContent] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)

  const [commentText, setCommentText] = useState<Record<string, string>>({})
const [image, setImage] = useState<File | null>(null)
const [previewImage, setPreviewImage] = useState<string | null>(null)
const [editImage, setEditImage] = useState<File | null>(null)
const [editPreview, setEditPreview] = useState<string | null>(null)

const [editText, setEditText] = useState('')

const editInputRef = useRef<HTMLInputElement>(null)

const fileRef = useRef<HTMLInputElement>(null)


const createFileRef = useRef<HTMLInputElement>(null)
const editFileRef = useRef<HTMLInputElement>(null)

const { data: session, status } = useSession()
const router = useRouter()

useEffect(() => {
  if (status === "unauthenticated") {
    router.push('/')
  }
}, [status, router])

  // 🔹 загрузка постов
  const fetchPosts = async () => {
    const res = await fetch('/api/posts')
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



  // 🔥 create / update
const createPost = async () => {
  if (!content.trim() && !image) return

  let imageUrl = previewImage || ''

  if (image) {
    const formData = new FormData()
    formData.append('file', image)

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    const data = await res.json()
    imageUrl = data.url
  }

  // ✅ ONLY CREATE
  await fetch('/api/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      content,
      authorId: session?.user.id,
      image: imageUrl
    })
  })

  setContent('')
  setImage(null)
  setPreviewImage(null)

  if (fileRef.current) {
    fileRef.current.value = ''
  }

  fetchPosts()
}

  // 🗑 delete
  const deletePost = async (id: string) => {
    await fetch(`/api/posts?id=${id}`, {
      method: 'DELETE'
    })

    fetchPosts()
  }

  // ✏️ edit (НОВЫЙ UX)
  const editPost = (post: Post) => {
  setEditingId(post.id)
  setEditText(post.content)

  setEditPreview(post.image || null)
  setEditImage(null)
}

  const likePost = async (postId: string) => {
  await fetch('/api/like', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ postId })
  })

  fetchPosts()
}

const addComment = async (postId: string) => {
  const text = commentText[postId]

  console.log('SEND COMMENT:', text, postId)

  if (!text?.trim()) return

  const res = await fetch('/api/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      postId,
      content: text
    })
  })

  console.log('RES:', res)

  setCommentText((prev) => ({
    ...prev,
    [postId]: ''
  }))

  fetchPosts()
}

useEffect(() => {
  if (editingId && editInputRef.current) {
    editInputRef.current.focus()
  }
}, [editingId])

if (status === "loading") return <p>Loading...</p>





  return (
  <div className="min-h-screen bg-gray-100">

    {/* HEADER */}
    <div className="max-w-2xl mx-auto pt-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Feed</h1>

      <Button
        variant="destructive"
        onClick={() => signOut({ callbackUrl: '/' })}
      >
        Logout
      </Button>
    </div>

    {/* CREATE POST */}
    <Card className="max-w-2xl mx-auto mt-6">
      <CardContent className="p-4 space-y-3">

        <Input
          ref={inputRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Напиши пост..."
        />

        {/* hidden file input */}
        <input
          ref={createFileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) setImage(file)
          }}
        />

        {/* preview */}
        {previewImage && (
          <img
            src={previewImage}
            className="w-32 rounded-lg"
          />
        )}

        {/* actions */}
        <div className="flex gap-2 items-center">
          <Button
            variant="outline"
            onClick={() => createFileRef.current?.click()}
          >
            📎 Attach
          </Button>

          <Button onClick={createPost} className="flex-1">
            Post
          </Button>
        </div>

      </CardContent>
    </Card>

    {/* POSTS LIST */}
    <div className="max-w-2xl mx-auto mt-6 space-y-4">

      {posts.map((post) => (
        <Card key={post.id}>
          <CardContent className="p-4 space-y-3">

            {/* EDIT MODE */}
            {editingId === post.id ? (
              <div className="space-y-3">

                <Input
                  ref={editInputRef}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />

                {/* hidden edit file input */}
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
                  <img
                    src={editPreview}
                    className="w-32 rounded-lg"
                  />
                )}

                {/* edit actions */}
                <div className="flex gap-2">
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
                          content: editText,
                          image: imageUrl
                        })
                      })

                      setEditingId(null)
                      setEditText('')
                      setEditImage(null)
                      setEditPreview(null)
                      fetchPosts()
                    }}
                  >
                    Save
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={() => {
                      setEditingId(null)
                      setEditText('')
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
                {/* CONTENT */}
                <p>{post.content}</p>

                {post.image && (
                  <img
                    src={post.image}
                    className="rounded-lg w-full"
                  />
                )}

                {/* AUTHOR */}
                <p className="text-xs text-gray-400">
                  {post.author?.email}
                </p>

                {/* ACTIONS */}
                <div className="flex gap-2 pt-2">

                  <Button
                    variant="destructive"
                    onClick={() => deletePost(post.id)}
                  >
                    Delete
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={() => editPost(post)}
                  >
                    Edit
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => likePost(post.id)}
                  >
                    ❤️ {post.likes?.length ?? 0}
                  </Button>

                </div>

                {/* COMMENTS */}
                <div className="pt-3 space-y-2">

                  <Input
                    value={commentText[post.id] || ''}
                    onChange={(e) =>
                      setCommentText((prev) => ({
                        ...prev,
                        [post.id]: e.target.value
                      }))
                    }
                    placeholder="Комментарий..."
                  />

                  <Button
                    size="sm"
                    onClick={() => addComment(post.id)}
                  >
                    Send
                  </Button>

                  <Separator />

                  <div className="space-y-1">
                    {post.comments?.map((comment) => (
                      <p
                        key={comment.id}
                        className="text-sm text-gray-600"
                      >
                        💬 {comment.content}
                      </p>
                    ))}
                  </div>

                </div>

              </>
            )}

          </CardContent>
        </Card>
      ))}

    </div>
  </div>
)
}

    
         