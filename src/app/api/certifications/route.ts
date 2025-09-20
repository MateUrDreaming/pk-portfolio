import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/generated/prisma'
import { getServerSession } from '@/lib/get-session'

const prisma = new PrismaClient()

// GET /api/certifications - Fetch all certifications
export async function GET() {
  try {
    const certifications = await prisma.certification.findMany({
      orderBy: {
        order: 'asc',
      },
    })
    
    return NextResponse.json(certifications)
  } catch (error) {
    console.error('Error fetching certifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch certifications' },
      { status: 500 }
    )
  }
}

// POST /api/certifications - Create new certification
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
      qualificationName,
      provider,
      dateReceived,
      proofLink,
      order = 0,
    } = body

    if (!qualificationName || !provider || !dateReceived) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const existing = await prisma.certification.findUnique({
      where: {
        qualificationName_provider: {
          qualificationName,
          provider,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Certification with this qualification name and provider already exists' },
        { status: 409 }
      )
    }

    const certification = await prisma.certification.create({
      data: {
        qualificationName,
        provider,
        dateReceived,
        proofLink,
        order,
      },
    })

    return NextResponse.json(certification, { status: 201 })
  } catch (error) {
    console.error('Error creating certification:', error)
    return NextResponse.json(
      { error: 'Failed to create certification' },
      { status: 500 }
    )
  }
}