import { Comment as PrismaComment, Prisma } from 'generated/prisma'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

export class PrismaQuestionCommentMapper {
  static toDomain(raw: PrismaComment): QuestionComment {
    if (!raw.questionId) {
      throw new Error('Invalid comment type.')
    }

    return QuestionComment.create(
      {
        questionId: new UniqueEntityId(raw.questionId),
        authorId: new UniqueEntityId(raw.authorId),
        content: raw.comment,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id)
    )
  }

  static toPrisma(
    questionComment: QuestionComment
  ): Prisma.CommentUncheckedCreateInput {
    return {
      id: questionComment.id.toString(),
      authorId: questionComment.authorId.toString(),
      questionId: questionComment.questionId.toString(),
      comment: questionComment.content,
      createdAt: questionComment.createdAt,
      updatedAt: questionComment.updatedAt,
    }
  }
}
