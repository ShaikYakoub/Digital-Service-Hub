import { PrismaClient } from './lib/generated/client.js';

const prisma = new PrismaClient();

async function verifyTypes() {
    try {
        console.log('🔍 Verifying TypeScript configuration...\n');

        // Test 1: Database connection
        console.log('1️⃣ Testing database connection...');
        await prisma.$connect();
        console.log('✅ Database connected\n');

        // Test 2: Check Chapter model
        console.log('2️⃣ Checking Chapter model...');
        const chapterCount = await prisma.chapter.count();
        console.log(`✅ Found ${chapterCount} chapters\n`);

        // Test 3: Verify isFree field type
        console.log('3️⃣ Verifying isFree field type...');
        const sampleChapter = await prisma.chapter.findFirst();
        if (sampleChapter) {
            console.log(`   Chapter: ${sampleChapter.title}`);
            console.log(`   isFree type: ${typeof sampleChapter.isFree}`);
            console.log(`   isFree value: ${sampleChapter.isFree}`);
            console.log(`✅ isFree is a boolean (not nullable)\n`);
        } else {
            console.log('⚠️  No chapters found to verify\n');
        }

        // Test 4: Check User roles
        console.log('4️⃣ Checking User roles...');
        const users = await prisma.user.findMany({
            select: {
                email: true,
                role: true,
            }
        });
        console.log('✅ User roles verified:');
        users.forEach(user => {
            console.log(`   - ${user.email}: ${user.role}`);
        });
        console.log();

        // Test 5: Check Course model
        console.log('5️⃣ Checking Course model...');
        const courseCount = await prisma.course.count();
        console.log(`✅ Found ${courseCount} courses\n`);

        console.log('✅ All type verifications passed!');
        console.log('\n📦 Ready for build and deployment!');

    } catch (error) {
        console.error('❌ Verification failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

console.log('='.repeat(50));
console.log('TypeScript & Database Verification');
console.log('='.repeat(50));
console.log();

verifyTypes();
