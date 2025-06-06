import { Either, right } from '@/core/either'
import { QuestionsCommentsRepository } from '../repositories/questions-comments-repository'
import { Injectable } from '@nestjs/common'
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author'

interface FetchQuestionCommentsUseCaseRequest {
  questionId: string
  page: number
}

type FetchQuestionCommentsUseCaseResponse = Either<
  null,
  {
    comments: CommentWithAuthor[]
  }
>

@Injectable()
export class FetchQuestionCommentsUseCase {
  constructor(
    private questionsCommentsRepository: QuestionsCommentsRepository
  ) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
    const comments =
      await this.questionsCommentsRepository.findManyByQuestionIdWithAuthor(
        questionId,
        {
          page,
        }
      )

    return right({ comments })
  }
}
