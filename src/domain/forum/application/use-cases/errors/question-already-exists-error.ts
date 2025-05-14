export class QuestionAlreadyExistsError extends Error {
  constructor() {
    super('Question with same slug already exists.')
  }
}
