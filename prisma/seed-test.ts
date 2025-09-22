import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding test database...');

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      id: 'test-admin-id',
      name: 'Test Admin',
      email: 'admin@example.com',
      emailVerified: true,
      role: 'admin',
    },
  });

  const regularUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      id: 'test-user-id',
      name: 'Test User',
      email: 'user@example.com',
      emailVerified: true,
      role: 'user',
    },
  });

  const workExperiences = [
    {
      title: 'Senior Software Engineer',
      company: 'Test Tech Corp',
      location: 'Remote',
      duration: '2022 - Present',
      description: 'Leading development of web applications using React and Node.js',
      technologies: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
      achievements: [
        'Improved application performance by 40%',
        'Led a team of 5 developers',
        'Implemented CI/CD pipeline'
      ],
      order: 1,
    },
    {
      title: 'Full Stack Developer',
      company: 'Test Startup Inc',
      location: 'San Francisco, CA',
      duration: '2020 - 2022',
      description: 'Developed and maintained full-stack applications',
      technologies: ['Vue.js', 'Express.js', 'MongoDB', 'AWS'],
      achievements: [
        'Built 3 major features from scratch',
        'Reduced server costs by 25%'
      ],
      order: 2,
    },
  ];

  for (const exp of workExperiences) {
    await prisma.workExperience.upsert({
      where: { 
        company_title: {
          company: exp.company,
          title: exp.title
        }
      },
      update: {},
      create: exp,
    });
  }

  const projects = [
    {
      title: 'E-commerce Platform',
      description: 'A full-featured e-commerce platform with payment integration',
      technologies: ['Next.js', 'Stripe', 'Prisma', 'PostgreSQL'],
      duration: '6 months',
      githubUrl: 'https://github.com/test/ecommerce',
      liveUrl: 'https://test-ecommerce.com',
      highlights: [
        'Payment processing with Stripe',
        'Admin dashboard',
        'Real-time inventory tracking'
      ],
      order: 1,
    },
    {
      title: 'Task Management App',
      description: 'A collaborative task management application',
      technologies: ['React', 'Node.js', 'Socket.io', 'Redis'],
      duration: '4 months',
      githubUrl: 'https://github.com/test/taskapp',
      liveUrl: 'https://test-tasks.com',
      highlights: [
        'Real-time collaboration',
        'Team management features',
        'Mobile responsive design'
      ],
      order: 2,
    },
    {
      title: 'Weather Dashboard',
      description: 'A beautiful weather dashboard with forecasting',
      technologies: ['Vue.js', 'Weather API', 'Chart.js'],
      duration: '2 months',
      githubUrl: 'https://github.com/test/weather',
      liveUrl: 'https://test-weather.com',
      highlights: [
        '7-day weather forecast',
        'Interactive charts',
        'Location-based weather'
      ],
      order: 3,
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { title: project.title },
      update: {},
      create: project,
    });
  }

  console.log('Test database seeded successfully!');
  console.log(`Created admin user: ${adminUser.email}`);
  console.log(`Created regular user: ${regularUser.email}`);
  console.log(`Created ${workExperiences.length} work experiences`);
  console.log(`Created ${projects.length} projects`);
}

main()
  .catch((e) => {
    console.error('Error seeding test database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
});