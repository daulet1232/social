'use client'
type Post = {
  id: string
  content: string
  createdAt: string
  author: {
    email: string
  }
}
import { useEffect, useState } from 'react'

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [content, setContent] = useState('')

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

  // 🔹 создание поста
  const createPost = async () => {
    await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content,
        authorId: 'daulet'
      })
    })

    setContent('')
    fetchPosts()
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Feed</h1>

      {/* форма */}
      <div>
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Напиши пост..."
        />
        <button onClick={createPost}>Отправить</button>
      </div>

      <hr />

      {/* список постов */}
      <div>
        {posts.map((post) => (
          <div key={post.id} style={{ marginBottom: 20 }}>
            <p>{post.content}</p>
            <small>{post.author?.email}</small>
          </div>
        ))}
      </div>
    </div>
  )
}