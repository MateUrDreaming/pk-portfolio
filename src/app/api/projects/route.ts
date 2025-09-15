import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/generated/prisma'
import { getServerSession } from '@/lib/get-session'

const prisma = new PrismaClient()

// GET /api/projects - Fetch all projects
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        order: 'asc',
      },
    })
    
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

// POST /api/projects - Create new project
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    const user = session?.user

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      title,
      description,
      technologies,
      duration,
      githubUrl,
      liveUrl,
      highlights,
      order = 0,
    } = body

    // Validate required fields
    if (!title || !description || !duration) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if project already exists
    const existing = await prisma.project.findUnique({
      where: { title },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Project with this title already exists' },
        { status: 409 }
      )
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        technologies: technologies || [],
        duration,
        githubUrl,
        liveUrl,
        highlights: highlights || [],
        order,
      },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}

