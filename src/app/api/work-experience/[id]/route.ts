import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/generated/prisma'
import { getServerSession } from '@/lib/get-session'

const prisma = new PrismaClient()

// GET /api/work-experience/[id] - Fetch work experience by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const workExperience = await prisma.workExperience.findUnique({
      where: { id },
    })

    if (!workExperience) {
      return NextResponse.json(
        { error: 'Work experience not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(workExperience)
  } catch (error) {
    console.error('Error fetching work experience:', error)
    return NextResponse.json(
      { error: 'Failed to fetch work experience' },
      { status: 500 }
    )
  }
}

// PUT /api/work-experience/[id] - Update work experience
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params
    const body = await request.json()
    const {
      title,
      company,
      location,
      duration,
      description,
      technologies,
      achievements,
      order,
    } = body

    // Check if work experience exists
    const existing = await prisma.workExperience.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Work experience not found' },
        { status: 404 }
      )
    }

    // Check for duplicate if title or company changed
    if (title !== existing.title || company !== existing.company) {
      const duplicate = await prisma.workExperience.findFirst({
        where: {
          AND: [
            { company },
            { title },
            { id: { not: id } },
          ],
        },
      })

      if (duplicate) {
        return NextResponse.json(
          { error: 'Work experience with this company and title already exists' },
          { status: 409 }
        )
      }
    }

    const workExperience = await prisma.workExperience.update({
      where: { id },
      data: {
        title,
        company,
        location,
        duration,
        description,
        technologies: technologies || [],
        achievements: achievements || [],
        order,
      },
    })

    return NextResponse.json(workExperience)
  } catch (error) {
    console.error('Error updating work experience:', error)
    return NextResponse.json(
      { error: 'Failed to update work experience' },
      { status: 500 }
    )
  }
}

// DELETE /api/work-experience/[id] - Delete work experience
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params

    // Check if work experience exists
    const existing = await prisma.workExperience.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Work experience not found' },
        { status: 404 }
      )
    }

    await prisma.workExperience.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Work experience deleted successfully' })
  } catch (error) {
    console.error('Error deleting work experience:', error)
    return NextResponse.json(
      { error: 'Failed to delete work experience' },
      { status: 500 }
    )
  }
}