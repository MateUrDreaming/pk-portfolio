import { GET, POST } from '@/app/api/projects/route';
import { 
  testPrisma, 
  clearDatabase, 
  createTestProject, 
  createTestAdmin,
  createMockRequest 
} from '../../utils/test-helper';

jest.mock('@/lib/get-session', () => ({
  getServerSession: jest.fn(),
}));

const { getServerSession } = require('@/lib/get-session');

describe('/api/projects', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await clearDatabase();
    await testPrisma.$disconnect();
  });

  describe('GET /api/projects', () => {
    it('should return all projects in order', async () => {
      await createTestProject({ title: 'Project 1', order: 2 });
      await createTestProject({ title: 'Project 2', order: 1 });
      await createTestProject({ title: 'Project 3', order: 3 });

      const request = createMockRequest();
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveLength(3);
      expect(data[0].title).toBe('Project 2'); // order: 1
      expect(data[1].title).toBe('Project 1'); // order: 2
      expect(data[2].title).toBe('Project 3'); // order: 3
    });

    it('should return empty array when no projects exist', async () => {
      const request = createMockRequest();
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveLength(0);
    });
  });

  describe('POST /api/projects', () => {
    it('should create a new project when user is admin', async () => {
      const admin = await createTestAdmin();
      getServerSession.mockResolvedValue({
        user: admin,
      });

      const projectData = {
        title: 'New Test Project',
        description: 'A new project for testing',
        technologies: ['React', 'Next.js'],
        duration: '6 months',
        githubUrl: 'https://github.com/test/project',
        liveUrl: 'https://test-project.com',
        highlights: ['Feature 1', 'Feature 2'],
        order: 1,
      };

      const request = createMockRequest({
        method: 'POST',
        body: projectData,
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.title).toBe(projectData.title);
      expect(data.description).toBe(projectData.description);
      expect(data.technologies).toEqual(projectData.technologies);

      const projectInDb = await testPrisma.project.findUnique({
        where: { title: projectData.title },
      });
      expect(projectInDb).toBeTruthy();
    });

    it('should return 401 when user is not authenticated', async () => {
      getServerSession.mockResolvedValue(null);

      const projectData = {
        title: 'Unauthorized Project',
        description: 'This should not be created',
        duration: '1 month',
      };

      const request = createMockRequest({
        method: 'POST',
        body: projectData,
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Authentication required');
    });

    it('should return 403 when user is not admin', async () => {
      const user = await createTestAdmin({ role: 'user' });
      getServerSession.mockResolvedValue({
        user,
      });

      const projectData = {
        title: 'Forbidden Project',
        description: 'This should not be created',
        duration: '1 month',
      };

      const request = createMockRequest({
        method: 'POST',
        body: projectData,
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe('Admin access required');
    });

    it('should return 400 when required fields are missing', async () => {
      const admin = await createTestAdmin();
      getServerSession.mockResolvedValue({
        user: admin,
      });

      const projectData = {
        title: 'Incomplete Project',
      };

      const request = createMockRequest({
        method: 'POST',
        body: projectData,
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required fields');
    });

    it('should return 409 when project with same title exists', async () => {
      const admin = await createTestAdmin();
      getServerSession.mockResolvedValue({
        user: admin,
      });

      await createTestProject({ title: 'Duplicate Project' });

      const projectData = {
        title: 'Duplicate Project',
        description: 'This should conflict',
        duration: '1 month',
      };

      const request = createMockRequest({
        method: 'POST',
        body: projectData,
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.error).toBe('Project with this title already exists');
    });
  });
});