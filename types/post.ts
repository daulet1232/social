export type Comment = {
  id: string
  content: string
  userId: string
  user?: {
    id: string
    email: string
  }
}

export type Post = {
  id: string
  content: string
  createdAt: string
  image: string | null
  authorId: string
  author: {
    email: string
  }
  likes: {
    id: string
    postId: string
  }[]
  comments: Comment[]
}