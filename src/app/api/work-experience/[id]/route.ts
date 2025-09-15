import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/generated/prisma'
import { getServerSession } from '@/lib/get-session'

const prisma = new PrismaClient()

// PUT /api/testimonials/[id] - Update testimonial
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    const user = session?.user

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { id } = params
    const body = await request.json()
    const {
      name,
      role,
      company,
      content,
      avatar,
      proofUrl,
      isApproved,
      order = 0,
    } = body

    // Validate required fields
    if (!name || !role || !company || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: name, role, company, and content are required' },
        { status: 400 }
      )
    }

    // Content length validation
    if (content.length > 500) {
      return NextResponse.json(
        { error: 'Content must be 500 characters or less' },
        { status: 400 }
      )
    }

    // Check if testimonial exists
    const existing = await prisma.testimonial.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      )
    }

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        name: name.trim(),
        role: role.trim(),
        company: company.trim(),
        content: content.trim(),
        avatar: avatar?.trim() || null,
        proofUrl: proofUrl?.trim() || null,
        isApproved: isApproved !== undefined ? isApproved : existing.isApproved,
        order,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(testimonial)
  } catch (error) {
    console.error('Error updating testimonial:', error)
    return NextResponse.json(
      { error: 'Failed to update testimonial' },
      { status: 500 }
    )
  }
}

// DELETE /api/testimonials/[id] - Delete testimonial
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    const user = session?.user

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { id } = params

    // Check if testimonial exists
    const existing = await prisma.testimonial.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      )
    }

    await prisma.testimonial.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Testimonial deleted successfully' })
  } catch (error) {
    console.error('Error deleting testimonial:', error)
    return NextResponse.json(
      { error: 'Failed to delete testimonial' },
      { status: 500 }
    )
  }
}

// PATCH /api/testimonials/[id] - Approve/Reject testimonial
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    const user = session?.user

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { id } = params
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    if (!action) {
      return NextResponse.json(
        { error: 'Action parameter is required (approve or reject)' },
        { status: 400 }
      )
    }

    if (action !== 'approve' && action !== 'reject') {
      return NextResponse.json(
        { error: 'Action must be either "approve" or "reject"' },
        { status: 400 }
      )
    }

    // Check if testimonial exists
    const existing = await prisma.testimonial.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      )
    }

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        isApproved: action === 'approve',
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(testimonial)
  } catch (error) {
    console.error('Error updating testimonial approval:', error)
    return NextResponse.json(
      { error: 'Failed to update testimonial approval' },
      { status: 500 }
    )
  }
}