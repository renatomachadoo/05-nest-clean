import { config } from 'dotenv'

import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { PrismaClient } from 'generated/prisma'

config({ path: '.env', override: true })
config({ path: '.env.test', override: true })

const prisma = new PrismaClient()

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable.')
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schemaId)

  return url.toString()
}

const schemaId = randomUUID()

beforeAll(async () => {
  const databaseUrl = generateUniqueDatabaseURL(schemaId)

  process.env.DATABASE_URL = databaseUrl

  execSync('pnpm prisma migrate deploy')
}, 30000)

afterAll(async () => {
  console.log(process.env.DATABASE_URL, schemaId)

  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await prisma.$disconnect()
})
