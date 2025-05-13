import { vi } from 'vitest'
import { AggregateRoot } from '../entities/aggregate-root'
import type { UniqueEntityId } from '../entities/unique-entity-id'
import type { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date
  private aggregate: CustomAggregate

  constructor(aggregate: CustomAggregate) {
    this.aggregate = aggregate
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityId {
    return this.aggregate.id
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null)

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))

    return aggregate
  }
}

describe('domain events', () => {
  it('should be able to dispatch and listen to events', () => {
    const callbackSpi = vi.fn()

    // Event listener added
    DomainEvents.register(callbackSpi, CustomAggregateCreated.name)

    // Create answer not saving on db
    const aggregate = CustomAggregate.create()

    // Checking if event was created but not dispatched
    expect(aggregate.domainEvents).toHaveLength(1)

    // Saving answer on db and dispatching event
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    // Callback called because event was dispatched
    expect(callbackSpi).toHaveBeenCalled()

    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
