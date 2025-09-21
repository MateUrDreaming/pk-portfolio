import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from '@/lib/get-session'

const prisma = new PrismaClient()

// GET /api/testimonials - Fetch testimonials
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeUnapproved = searchParams.get('includeUnapproved') === 'true'
    
    // Check if user is admin for unapproved testimonials
    if (includeUnapproved) {
      const session = await getServerSession()
      const user = session?.user

      if (!user || user.role !== 'admin') {
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        )
      }
    }

    const testimonials = await prisma.testimonial.findMany({
      where: includeUnapproved ? {} : { isApproved: true },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ],
    })
    
    return NextResponse.json(testimonials)
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    )
  }
}

// POST /api/testimonials - Create new testimonial
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      role,
      company,
      content,
      avatar,
      proofUrl,
      isUserSubmitted = true,
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

    // Check if this is an admin creating a testimonial
    let isAdminCreated = false
    let shouldAutoApprove = false
    
    if (!isUserSubmitted) {
      const session = await getServerSession()
      const user = session?.user

      if (!user || user.role !== 'admin') {
        return NextResponse.json(
          { error: 'Admin access required to create admin testimonials' },
          { status: 403 }
        )
      }
      
      isAdminCreated = true
      shouldAutoApprove = true
    }

    // For user submissions, don't allow proofUrl
    const testimonialData = {
      name: name.trim(),
      role: role.trim(),
      company: company.trim(),
      content: content.trim(),
      avatar: avatar?.trim() || null,
      proofUrl: isAdminCreated ? (proofUrl?.trim() || null) : null,
      isUserSubmitted: !isAdminCreated,
      isApproved: shouldAutoApprove,
      order,
    }

    const testimonial = await prisma.testimonial.create({
      data: testimonialData,
    })

    return NextResponse.json(testimonial, { status: 201 })
  } catch (error) {
    console.error('Error creating testimonial:', error)
    return NextResponse.json(
      { error: 'Failed to create testimonial' },
      { status: 500 }
    )
  }
}