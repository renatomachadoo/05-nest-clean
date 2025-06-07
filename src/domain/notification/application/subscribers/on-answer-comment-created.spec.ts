import { makeAnswer } from 'test/factories/make-answer'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersCommentsRepository } from 'test/repositories/in-memory-answers-comments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { waitFor } from 'test/utils/wait-for'
import type { MockInstance } from 'vitest'
import {
  SendNotificationUseCase,
  type SendNotificationUseCaseRequest,
  type SendNotificationUseCaseResponse,
} from '../use-cases/send-notification'
import { OnAnswerCommentCreated } from './on-answer-comment-created'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase
let inMemoryAnswersCommentsRepository: InMemoryAnswersCommentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository

type SendNotificationFunction = (
  request: SendNotificationUseCaseRequest
) => Promise<SendNotificationUseCaseResponse>

let sendNotificationExecuteSpy: MockInstance<SendNotificationFunction>

describe('On answer comment created', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository
    )

    inMemoryStudentsRepository = new InMemoryStudentsRepository()

    inMemoryAnswersCommentsRepository = new InMemoryAnswersCommentsRepository(
      inMemoryStudentsRepository
    )
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()

    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnAnswerCommentCreated(
      inMemoryAnswersRepository,
      sendNotificationUseCase
    )
  })

  it('Should send a notification when an answer comment is created', async () => {
    const answer = makeAnswer()
    const answerComment = makeAnswerComment({ answerId: answer.id })

    await inMemoryAnswersRepository.create(answer)

    await inMemoryAnswersCommentsRepository.create(answerComment)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
