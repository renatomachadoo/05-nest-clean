import { Comment as PrismaComment, Prisma } from 'generated/prisma'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

export class PrismaAnswerCommentMapper {
  static toDomain(raw: PrismaComment): AnswerComment {
    if (!raw.answerId) {
      throw new Error('Invalid comment type.')
    }

    return AnswerComment.create(
      {
        answerId: new UniqueEntityId(raw.answerId),
        authorId: new UniqueEntityId(raw.authorId),
        content: raw.comment,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id)
    )
  }

  static toPrisma(
    answerComment: AnswerComment
  ): Prisma.CommentUncheckedCreateInput {
    return {
      id: answerComment.id.toString(),
      authorId: answerComment.authorId.toString(),
      answerId: answerComment.answerId.toString(),
      comment: answerComment.content,
      createdAt: answerComment.createdAt,
      updatedAt: answerComment.updatedAt,
    }
  }
}
