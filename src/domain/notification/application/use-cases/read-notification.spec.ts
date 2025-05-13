import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { makeNotification } from 'test/factories/make-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { ReadNotificationUseCase } from './read-notification'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: ReadNotificationUseCase

describe('Read Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()

    sut = new ReadNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('should be possible to read a notification', async () => {
    const newNotification = makeNotification()

    await inMemoryNotificationsRepository.create(newNotification)

    const result = await sut.execute({
      notificationId: newNotification.id.toString(),
      recipientId: newNotification.recipientId.toString(),
    })

    expect(result.isRight()).toEqual(true)
    expect(inMemoryNotificationsRepository.items[0].readAt).toEqual(
      expect.any(Date)
    )
  })

  it('should not be able to read a notification from another user', async () => {
    const newNotification = makeNotification({
      recipientId: new UniqueEntityId('recipient-1'),
    })

    await inMemoryNotificationsRepository.create(newNotification)

    const result = await sut.execute({
      notificationId: newNotification.id.toString(),
      recipientId: 'recipient-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
