export type Post = {
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