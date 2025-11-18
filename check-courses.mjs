import 'dotenv/config';
import { PrismaClient } from './lib/generated/client.js';

const prisma = new PrismaClient();

async function checkCourses() {
    try {
        console.log('Checking all courses and users...\n');

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
            console.log(`ID: ${user.id}`);
            console.log(`Email: ${user.email}`);
            console.log(`Role: ${user.role}`);
            console.log(`Name: ${user.name}`);
            console.log('---');
        });

        const courses = await prisma.course.findMany({
            select: {
                id: true,
                title: true,
                userId: true,
                isPublished: true,
                createdAt: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        console.log('\n=== COURSES ===');
        courses.forEach(course => {
            console.log(`Title: ${course.title}`);
            console.log(`ID: ${course.id}`);
            console.log(`Created by userId: ${course.userId}`);
            console.log(`Published: ${course.isPublished}`);
            console.log(`Created: ${course.createdAt}`);
            console.log('---');
        });

        console.log(`\nTotal users: ${users.length}`);
        console.log(`Total courses: ${courses.length}`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkCourses();
