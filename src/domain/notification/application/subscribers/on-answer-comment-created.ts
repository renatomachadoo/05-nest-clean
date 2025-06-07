import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { AnswerCommentCreatedEvent } from '@/domain/forum/enterprise/events/answer-comment-created-event'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { Injectable } from '@nestjs/common'

@Injectable()
export class OnAnswerCommentCreated implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private sendNotification: SendNotificationUseCase
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerCommentNotification.bind(this),
      AnswerCommentCreatedEvent.name
    )
  }

  private async sendNewAnswerCommentNotification({
    answerComment,
  }: AnswerCommentCreatedEvent) {
    const answer = await this.answersRepository.findById(
      answerComment.answerId.toString()
    )

    if (answer) {
      this.sendNotification.execute({
        recipientId: answer.authorId.toString(),
        title: `New comment in ${answer.excerpt.substring(0, 40).concat('...')}`,
        content: answer.excerpt,
      })
    }
  }
}
