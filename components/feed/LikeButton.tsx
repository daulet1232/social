'use client'

import { Button } from "@/components/ui/button"

type Props = {
  postId: string
  likesCount: number
  onLike: (postId: string) => void
  onDelete: (postId: string) => void
  onEdit: () => void
}

export default function PostActions({
  postId,
  likesCount,
  onLike,
  onDelete,
  onEdit
}: Props) {
  return (
    <div className="flex gap-2 mt-3">

      <Button
        variant="destructive"
        onClick={() => onDelete(postId)}
      >
        Delete
      </Button>

      <Button
        variant="secondary"
        onClick={onEdit}
      >
        Edit
      </Button>

      <Button
        variant="outline"
        onClick={() => onLike(postId)}
      >
        ❤️ {likesCount}
      </Button>

    </div>
  )
}