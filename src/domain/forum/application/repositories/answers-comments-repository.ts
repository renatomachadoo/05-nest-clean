import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { AnswerComment } from '../../enterprise/entities/answer-comment'

export interface AnswersCommentsRepository {
  findById(id: string): Promise<AnswerComment | null>
  findManyByAnswerId(
    id: string,
    params: PaginationParams
  ): Promise<AnswerComment[]>
  create(answerComment: AnswerComment): Promise<void>
  delete(answerComment: AnswerComment): Promise<void>
}
