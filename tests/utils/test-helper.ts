import { PrismaClient } from '@prisma/client';
import { NextRequest } from 'next/server';

export const testPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

export const createTestUser = async (overrides: any = {}) => {
  return await testPrisma.user.create({
    data: {
      id: `test-user-${Date.now()}`,
      name: 'Test User',
      email: `test-${Date.now()}@example.com`,
      emailVerified: true,
      role: 'user',
      ...overrides,
    },
  });
};

export const createTestAdmin = async (overrides: any = {}) => {
  return await createTestUser({
    role: 'admin',
    email: `admin-${Date.now()}@example.com`,
    ...overrides,
  });
};

export const createTestProject = async (overrides: any = {}) => {
  return await testPrisma.project.create({
    data: {
      title: `Test Project ${Date.now()}`,
      description: 'A test project for testing purposes',
      technologies: ['React', 'TypeScript'],
      duration: '3 months',
      order: 0,
      ...overrides,
    },
  });
};

export const createTestWorkExperience = async (overrides: any = {}) => {
  return await testPrisma.workExperience.create({
    data: {
      title: `Test Position ${Date.now()}`,
      company: `Test Company ${Date.now()}`,
      location: 'Test Location',
      duration: '2022 - 2023',
      description: 'Test job description',
      technologies: ['JavaScript', 'Node.js'],
      achievements: ['Test achievement'],
      order: 0,
      ...overrides,
    },
  });
};

export const clearDatabase = async () => {
  const tablenames = await testPrisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  const tables = tablenames
    .map(({ tablename }) => tablename)
    .filter((name) => name !== '_prisma_migrations')
    .map((name) => `"public"."${name}"`)
    .join(', ');

  try {
    await testPrisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
  } catch (error) {
    console.log({ error });
  }
};

export const mockSession = (user: any) => {
  return {
    user,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };
};

export const createMockRequest = (options: {
  method?: string;
  url?: string;
  body?: any;
  headers?: Record<string, string>;
} = {}) => {
  const { method = 'GET', url = 'http://localhost:3000', body, headers = {} } = options;
  
  return new NextRequest(url, {
    method,
    headers: {
      'content-type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
};

export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));