import 'dotenv/config'
import { PrismaClient } from '../lib/generated/client.ts'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password = await hash('password123', 12)
  
  const user = await prisma.user.upsert({
    where: { email: 'admin@krazycoders.com' },
    update: {},
    create: {
      email: 'admin@krazycoders.com',
      name: 'Admin User',
      password,
      role: 'ADMIN',
    },
  })
  console.log({ user })
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })