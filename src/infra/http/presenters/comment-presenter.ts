import { Comment } from '@/domain/forum/enterprise/entities/comment'

export class CommentPresenter {
  static toHttp(questionComment: Comment<any>) {
    return {
      id: questionComment.id.toString(),
      content: questionComment.content,
      createdAt: questionComment.createdAt,
      updatedAt: questionComment.updatedAt,
    }
  }
}
