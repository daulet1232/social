'use client'
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from 'react'

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
    <div
      style={{
        maxWidth: 600,
        margin: '0 auto',
        padding: 20,
        fontFamily: 'Arial, sans-serif',
        background: '#f6f7f9',
        minHeight: '100vh'
      }}
    >
      <button
  onClick={() => signOut({ callbackUrl: '/' })}
  style={{
    padding: '6px 10px',
    borderRadius: 6,
    background: 'black',
    color: 'white',
    cursor: 'pointer'
  }}
>
  Logout
</button>
      <h1 style={{ textAlign: 'center', marginBottom: 20 }}>
        Feed
      </h1>

      {/* форма */}
      <div
        style={{
          display: 'flex',
          gap: 10,
          marginBottom: 20,
          background: 'white',
          padding: 15,
          borderRadius: 12,
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}
      >
        <input
          ref={inputRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Напиши пост..."
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 8,
            border: '1px solid #ddd',
            outline: 'none'
          }}
          
        />
       
        <input
        ref={fileRef}
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files?.[0]
    if (file) setImage(file)
  }}
/>
{previewImage && (
  <div style={{ marginBottom: 10 }}>
    <img
      src={previewImage}
      style={{
        width: 120,
        borderRadius: 10
      }}
    />

    <p style={{ fontSize: 12, color: '#666' }}>
      текущая картинка
    </p>
  </div>
)}
        <button
          onClick={createPost}
          style={{
            padding: '10px 16px',
            background: '#000',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer'
          }}
        >
          отправить
        </button>
      </div>

      {/* список постов */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {posts.map((post) => (
          <div
            key={post.id}
            style={{
              background: 'white',
              padding: 15,
              borderRadius: 12,
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              animation: 'fadeIn 0.25s ease',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform =
                'translateY(-3px)'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform =
                'translateY(0)'
            }}
          >
            {editingId === post.id ? (
  <div>
    <input
    ref={editInputRef}
      value={editText}
      onChange={(e) => setEditText(e.target.value)}
    />

    {/* КАРТИНКА */}
    {editPreview && (
      <img
        src={editPreview}
        style={{ width: 120, borderRadius: 10, marginTop: 10 }}
      />
    )}

    <input
      type="file"
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files?.[0]
        if (file) {
          setEditImage(file)
          setEditPreview(URL.createObjectURL(file))
        }
      }}
    />
{/* inline edit */}
    <button
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
    </button>

    <button
      onClick={() => {
        setEditingId(null)
        setEditText('')
        setEditImage(null)
        setEditPreview(null)
      }}
    >
      Cancel
    </button>
  </div>
) : (
  <>
    <p>{post.content}</p>

    {post.image && (
      <img
        src={post.image}
        style={{ width: '100%', borderRadius: 10 }}
      />
    )}
  </>
)}

            <small style={{ color: '#666' }}>
              {post.author?.email}
            </small>
          

            <div style={{ marginTop: 10, display: 'flex', gap: 10 }}>
              <button
                onClick={() => deletePost(post.id)}
                style={{
                  padding: '6px 10px',
                  border: 'none',
                  borderRadius: 6,
                  background: '#ff4d4f',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>

              <button
                onClick={() => editPost(post)}
                style={{
                  padding: '6px 10px',
                  border: 'none',
                  borderRadius: 6,
                  background: '#1677ff',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Edit
              </button>

              <button onClick={() => likePost(post.id)}>
  ❤️ {post.likes?.length ?? 0}
</button>
<br />
<div style={{ marginTop: 10 }}>
                <input
                    value={commentText[post.id] || ''}
                    onChange={(e) =>
                    setCommentText((prev) => ({
                        ...prev,
                        [post.id]: e.target.value
                    }))
                    }
                    placeholder="Комментарий..."
                    style={{
                    padding: '6px 10px',
                    borderRadius: 6,
                    border: '1px solid #ddd',
                    outline: 'none',
                    width: '100%'
                    }}
                />

                <button
                    onClick={() => addComment(post.id)}
                    style={{
                    padding: '6px 10px',
                    borderRadius: 6,
                    background: '#28a745',
                    color: 'white',
                    cursor: 'pointer',
                    marginTop: '8px'
                    }}
                >
                    Send
                </button>

                {/* Список комментариев */}
                <div style={{ marginTop: 10 }}>
                    {post.comments?.map((comment) => (
                    <p key={comment.id} style={{ fontSize: 12 }}>
                        💬 {comment.content}
                    </p>
                    ))}
                </div>
                </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

    
         