import type { Metadata } from "next";
import { ContactSection } from "@/features/portfolio/components/contact/contact-section";
import { getServerSession } from "@/lib/get-session";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with me for projects, collaborations, or questions.",
};

export default async function ContactPage() {
  const session = await getServerSession();
  const user = session?.user;

  return (
    <main>
      <ContactSection user={user} />
    </main>
  );
}