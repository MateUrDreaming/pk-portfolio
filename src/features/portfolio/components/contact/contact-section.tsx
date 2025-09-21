import { ContactForm } from "./contact-form";
import { ContactHeader } from "./contact-header";
import { ContactInfo } from "./contact-info";

interface ContactSectionProps {
  user?: any;
}

export function ContactSection({ user }: ContactSectionProps) {
  return (
    <section className="min-h-svh bg-background pt-20 md:pt-32 pb-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="space-y-12">
          <ContactHeader />
          
          <div className="max-w-2xl mx-auto space-y-8">
            <ContactInfo />
            <ContactForm user={user} />
          </div>
        </div>
      </div>
    </section>
  );
}