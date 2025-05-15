import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { AnswerComment } from '../../enterprise/entities/answer-comment'

export abstract class AnswersCommentsRepository {
  abstract findById(id: string): Promise<AnswerComment | null>
  abstract findManyByAnswerId(
    id: string,
    params: PaginationParams
  ): Promise<AnswerComment[]>
  abstract create(answerComment: AnswerComment): Promise<void>
  abstract delete(answerComment: AnswerComment): Promise<void>
}
