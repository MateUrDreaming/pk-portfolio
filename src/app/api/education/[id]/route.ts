import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from '@/lib/get-session'

const prisma = new PrismaClient()

// GET /api/education/[id] - Fetch education by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const education = await prisma.education.findUnique({
      where: { id },
    })

    if (!education) {
      return NextResponse.json(
        { error: 'Education not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(education)
  } catch (error) {
    console.error('Error fetching education:', error)
    return NextResponse.json(
      { error: 'Failed to fetch education' },
      { status: 500 }
    )
  }
}

// PUT /api/education/[id] - Update education
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
      degree,
      field,
      institution,
      location,
      duration,
      description,
      gpa,
      coursework,
      achievements,
      order,
    } = body

    // Check if education exists
    const existing = await prisma.education.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Education not found' },
        { status: 404 }
      )
    }

    // Check for duplicate if degree, field, or institution changed
    if (degree !== existing.degree || field !== existing.field || institution !== existing.institution) {
      const duplicate = await prisma.education.findFirst({
        where: {
          AND: [
            { degree },
            { field },
            { institution },
            { id: { not: id } },
          ],
        },
      })

      if (duplicate) {
        return NextResponse.json(
          { error: 'Education with this degree, field, and institution already exists' },
          { status: 409 }
        )
      }
    }

    const education = await prisma.education.update({
      where: { id },
      data: {
        degree,
        field,
        institution,
        location,
        duration,
        description,
        gpa,
        coursework: coursework || [],
        achievements: achievements || [],
        order,
      },
    })

    return NextResponse.json(education)
  } catch (error) {
    console.error('Error updating education:', error)
    return NextResponse.json(
      { error: 'Failed to update education' },
      { status: 500 }
    )
  }
}

// DELETE /api/education/[id] - Delete education
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

    const existing = await prisma.education.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Education not found' },
        { status: 404 }
      )
    }

    await prisma.education.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Education deleted successfully' })
  } catch (error) {
    console.error('Error deleting education:', error)
    return NextResponse.json(
      { error: 'Failed to delete education' },
      { status: 500 }
    )
  }
}