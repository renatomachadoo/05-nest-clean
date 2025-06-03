import { Attachment } from '@/domain/forum/enterprise/entities/attachment'
import { Prisma } from 'generated/prisma'

export class PrismaAttachmentMapper {
  static toPrisma(
    attachment: Attachment
  ): Prisma.AttachmentUncheckedCreateInput {
    return {
      id: attachment.id.toString(),
      title: attachment.title,
      url: attachment.url,
    }
  }
}
