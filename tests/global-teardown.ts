import { PrismaClient } from '@prisma/client';

async function globalTeardown() {
  console.log('Cleaning up test environment...');
  
  try {
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
    
    await prisma.$executeRaw`TRUNCATE TABLE "user", "session", "account", "verification", "work_experience", "project" RESTART IDENTITY CASCADE`;
    
    await prisma.$disconnect();
    
    console.log('Test environment cleanup complete!');
  } catch (error) {
    console.error('Failed to cleanup test environment:', error);
  }
}

export default globalTeardown;