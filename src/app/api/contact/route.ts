import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { contactFormSchema } from "@/features/portfolio/types/contact/types";
import { getServerSession } from "@/lib/get-session";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    const body = await request.json();
    
    const validatedData = contactFormSchema.parse(body);
    const { name, email, phone, company, subject, message, inquiryType } = validatedData;

    const inquiryTypeLabels = {
      general: "General Inquiry",
      project: "Project Collaboration",
      job: "Job Opportunity", 
      consulting: "Consulting",
      speaking: "Speaking Engagement",
      other: "Other"
    };

    const userStatus = session?.user ? `Authenticated User: ${session.user.name} (${session.user.email})` : "Anonymous User";
    
    const emailContent = `
New contact form submission from ${name}

Contact Details:
- Name: ${name}
- Email: ${email}
- Phone: ${phone || "Not provided"}
- Company: ${company || "Not provided"}
- Inquiry Type: ${inquiryTypeLabels[inquiryType]}
- User Status: ${userStatus}

Subject: ${subject}

Message:
${message}

---
Sent from your portfolio contact form
    `.trim();

    await sendEmail({
      to: process.env.CONTACT_EMAIL || "pkp0rtf010@gmail.com",
      subject: `Contact Form: ${subject}`,
      text: emailContent,
    });

    const autoReplyContent = `
Hi ${name},

Thank you for reaching out! I've received your message about "${subject}" and will get back to you as soon as possible, usually within 24 hours.

In the meantime, feel free to check out my work on GitHub (github.com/MateUrDreaming) or connect with me on LinkedIn (linkedin.com/in/parinkasabia).

Ngā mihi,
Parin Kasabia

---
This is an automated response. Please don't reply to this email.
    `.trim();

    await sendEmail({
      to: email,
      subject: `Thanks for reaching out, ${name}!`,
      text: autoReplyContent,
    });

    return NextResponse.json(
      { message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { message: "Invalid form data" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}