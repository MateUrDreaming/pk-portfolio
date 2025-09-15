import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/generated/prisma'
import { getServerSession } from '@/lib/get-session'

const prisma = new PrismaClient()

// GET /api/projects/[id] - Fetch project by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const project = await prisma.project.findUnique({
      where: { id },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}

// PUT /api/projects/[id] - Update project
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params
    const body = await request.json()
    const {
      title,
      description,
      technologies,
      duration,
      githubUrl,
      liveUrl,
      highlights,
      order,
    } = body

    // Check if project exists
    const existing = await prisma.project.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Check for duplicate if title changed
    if (title !== existing.title) {
      const duplicate = await prisma.project.findFirst({
        where: {
          AND: [
            { title },
            { id: { not: id } },
          ],
        },
      })

      if (duplicate) {
        return NextResponse.json(
          { error: 'Project with this title already exists' },
          { status: 409 }
        )
      }
    }

    const project = await prisma.project.update({
      where: { id },
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

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

// DELETE /api/projects/[id] - Delete project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params

    // Check if project exists
    const existing = await prisma.project.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    await prisma.project.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}