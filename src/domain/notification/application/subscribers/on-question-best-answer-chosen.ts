import { DomainEvents } from '@/core/events/domain-events'
import type { EventHandler } from '@/core/events/event-handler'
import type { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import type { SendNotificationUseCase } from '../use-cases/send-notification'
import { QuestionBestAnswerChosenEvent } from './../../../forum/enterprise/events/question-best-answer-chosen-event'

export class OnQuestionBestAnswerChosen implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private sendNotification: SendNotificationUseCase
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendQuestionBestAnswerNotification.bind(this),
      QuestionBestAnswerChosenEvent.name
    )
  }

  private async sendQuestionBestAnswerNotification({
    question,
    bestAnswerId,
  }: QuestionBestAnswerChosenEvent) {
    const answer = await this.answersRepository.findById(
      bestAnswerId.toString()
    )

    if (answer) {
      this.sendNotification.execute({
        recipientId: answer.authorId.toString(),
        title: 'Your answer was chosen!',
        content: `The response you send in ${question.title.substring(0, 20).concat('...')} was chosen!`,
      })
    }
  }
}
