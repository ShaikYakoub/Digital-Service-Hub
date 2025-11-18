import pkg from '@prisma/client';
import bcrypt from 'bcryptjs';

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

async function main() {
    const hash = await bcrypt.hash('password123', 10);
    const user = await prisma.user.upsert({
        where: { email: 'test@test.com' },
        update: { password: hash },
        create: {
            email: 'test@test.com',
            name: 'Test User',
            password: hash,
            role: 'USER'
        }
    });
    console.log('Test user created/updated:', user.email);
    console.log('Email: test@test.com');
    console.log('Password: password123');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
