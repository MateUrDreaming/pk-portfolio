import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/generated/prisma'
import { getServerSession } from '@/lib/get-session'

const prisma = new PrismaClient()

// GET /api/education - Fetch all education
export async function GET() {
  try {
    const education = await prisma.education.findMany({
      orderBy: {
        order: 'asc',
      },
    })
    
    return NextResponse.json(education)
  } catch (error) {
    console.error('Error fetching education:', error)
    return NextResponse.json(
      { error: 'Failed to fetch education' },
      { status: 500 }
    )
  }
}

// POST /api/education - Create new education
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
      degree,
      field,
      institution,
      location,
      duration,
      description,
      gpa,
      coursework,
      achievements,
      order = 0,
    } = body

    if (!degree || !field || !institution || !location || !duration || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const existing = await prisma.education.findFirst({
      where: {
        AND: [
          { degree },
          { field },
          { institution },
        ],
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Education with this degree, field, and institution already exists' },
        { status: 409 }
      )
    }

    const education = await prisma.education.create({
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

    return NextResponse.json(education, { status: 201 })
  } catch (error) {
    console.error('Error creating education:', error)
    return NextResponse.json(
      { error: 'Failed to create education' },
      { status: 500 }
    )
  }
}