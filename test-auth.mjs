import 'dotenv/config';
import { PrismaClient } from './lib/generated/client.ts';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function testAuth() {
    try {
        console.log('Testing authentication...\n');

        const email = 'admin@krazycoders.com';
        const password = 'password123';

        console.log(`Looking for user: ${email}`);
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            console.log('❌ User not found!');
            return;
        }

        console.log('✅ User found:', {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            hasPassword: !!user.password
        });

        if (user.password) {
            console.log('\nTesting password...');
            const isValid = await bcrypt.compare(password, user.password);
            console.log(`Password valid: ${isValid ? '✅ YES' : '❌ NO'}`);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testAuth();
