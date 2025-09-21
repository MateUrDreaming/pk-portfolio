// src/app/api/work-experience/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from '@/lib/get-session'

const prisma = new PrismaClient()

// GET /api/work-experience - Fetch all work experience
export async function GET() {
  try {
    const workExperience = await prisma.workExperience.findMany({
      orderBy: {
        order: 'asc',
      },
    })
    
    return NextResponse.json(workExperience)
  } catch (error) {
    console.error('Error fetching work experience:', error)
    return NextResponse.json(
      { error: 'Failed to fetch work experience' },
      { status: 500 }
    )
  }
}

// POST /api/work-experience - Create new work experience
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
      company,
      location,
      duration,
      description,
      technologies,
      achievements,
      order = 0,
    } = body

    // Validate required fields
    if (!title || !company || !location || !duration || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if work experience already exists
    const existing = await prisma.workExperience.findUnique({
      where: {
        company_title: {
          company,
          title,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Work experience with this company and title already exists' },
        { status: 409 }
      )
    }

    const workExperience = await prisma.workExperience.create({
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

    return NextResponse.json(workExperience, { status: 201 })
  } catch (error) {
    console.error('Error creating work experience:', error)
    return NextResponse.json(
      { error: 'Failed to create work experience' },
      { status: 500 }
    )
  }
}

