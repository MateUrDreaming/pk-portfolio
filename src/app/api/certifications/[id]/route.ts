import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/generated/prisma'
import { getServerSession } from '@/lib/get-session'

const prisma = new PrismaClient()

// GET /api/certifications/[id] - Fetch certification by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const certification = await prisma.certification.findUnique({
      where: { id },
    })

    if (!certification) {
      return NextResponse.json(
        { error: 'Certification not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(certification)
  } catch (error) {
    console.error('Error fetching certification:', error)
    return NextResponse.json(
      { error: 'Failed to fetch certification' },
      { status: 500 }
    )
  }
}

// PUT /api/certifications/[id] - Update certification
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
      qualificationName,
      provider,
      dateReceived,
      proofLink,
      order,
    } = body

    // Check if certification exists
    const existing = await prisma.certification.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Certification not found' },
        { status: 404 }
      )
    }

    if (qualificationName !== existing.qualificationName || provider !== existing.provider) {
      const duplicate = await prisma.certification.findFirst({
        where: {
          AND: [
            { qualificationName },
            { provider },
            { id: { not: id } },
          ],
        },
      })

      if (duplicate) {
        return NextResponse.json(
          { error: 'Certification with this qualification name and provider already exists' },
          { status: 409 }
        )
      }
    }

    const certification = await prisma.certification.update({
      where: { id },
      data: {
        qualificationName,
        provider,
        dateReceived,
        proofLink,
        order,
      },
    })

    return NextResponse.json(certification)
  } catch (error) {
    console.error('Error updating certification:', error)
    return NextResponse.json(
      { error: 'Failed to update certification' },
      { status: 500 }
    )
  }
}

// DELETE /api/certifications/[id] - Delete certification
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

    const existing = await prisma.certification.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Certification not found' },
        { status: 404 }
      )
    }

    await prisma.certification.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Certification deleted successfully' })
  } catch (error) {
    console.error('Error deleting certification:', error)
    return NextResponse.json(
      { error: 'Failed to delete certification' },
      { status: 500 }
    )
  }
}