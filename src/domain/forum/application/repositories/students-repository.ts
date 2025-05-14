import { Student } from './../../enterprise/entities/student'

export abstract class QuestionsRepository {
  abstract findByEmail(email: string): Promise<Student | null>
  abstract create(Student: Student): Promise<void>
}
