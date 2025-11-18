import 'dotenv/config';
import { PrismaClient } from './lib/generated/client.js';

const prisma = new PrismaClient();

async function cleanupAndVerify() {
    try {
        console.log('Starting cleanup and verification...\n');

        // Get all users
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                name: true
            }
        });

        console.log('=== USERS ===');
        users.forEach(user => {
            console.log(`ID: ${user.id}, Email: ${user.email}, Role: ${user.role}, Name: ${user.name}`);
        });

        // Get all courses
        const allCourses = await prisma.course.findMany({
            select: {
                id: true,
                title: true,
                userId: true,
                isPublished: true
            }
        });

        console.log(`\n=== CURRENT COURSES (${allCourses.length}) ===`);
        allCourses.forEach(course => {
            console.log(`Title: ${course.title}, UserID: ${course.userId}, Published: ${course.isPublished}`);
        });

        // Find orphaned courses (courses with invalid userId)
        const validUserIds = users.map(u => u.id);
        const orphanedCourses = allCourses.filter(c => !validUserIds.includes(c.userId));

        if (orphanedCourses.length > 0) {
            console.log(`\n⚠️  Found ${orphanedCourses.length} orphaned courses (invalid userId)`);
            console.log('These courses will be deleted:\n');
            orphanedCourses.forEach(course => {
                console.log(`  - ${course.title} (ID: ${course.id}, UserID: ${course.userId})`);
            });

            // Delete orphaned courses
            for (const course of orphanedCourses) {
                await prisma.course.delete({
                    where: { id: course.id }
                });
                console.log(`  ✓ Deleted: ${course.title}`);
            }
        } else {
            console.log('\n✅ No orphaned courses found');
        }

        // Verify courses by admin
        const adminUser = users.find(u => u.role === 'ADMIN');
        if (adminUser) {
            const adminCourses = await prisma.course.findMany({
                where: { userId: adminUser.id },
                include: {
                    chapters: true,
                    _count: {
                        select: {
                            purchases: true
                        }
                    }
                }
            });

            console.log(`\n=== ADMIN (${adminUser.email}) COURSES (${adminCourses.length}) ===`);
            adminCourses.forEach(course => {
                console.log(`  - ${course.title}`);
                console.log(`    ID: ${course.id}`);
                console.log(`    Published: ${course.isPublished}`);
                console.log(`    Chapters: ${course.chapters.length}`);
                console.log(`    Sales: ${course._count.purchases}`);
            });
        } else {
            console.log('\n⚠️  No admin user found!');
        }

        console.log('\n✅ Cleanup and verification complete!');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

cleanupAndVerify();
