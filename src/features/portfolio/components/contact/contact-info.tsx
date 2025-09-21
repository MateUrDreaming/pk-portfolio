import { Card, CardContent } from "@/components/ui/card";
import { Mail, MapPin, Clock, Coffee, Lightbulb } from "lucide-react";
import Link from "next/link";

export function ContactInfo() {
  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <h3 className="text-xl font-semibold">Get in Touch</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Mail className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-medium">Email</p>
              <Link 
                href="mailto:pkasabia0909@gmail.com"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                pkasabia0909@gmail.com
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-medium">Location</p>
              <p className="text-muted-foreground">Auckland, New Zealand</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-medium">Response Time</p>
              <p className="text-muted-foreground">Usually within 24 hours</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Coffee className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-medium">Coffee Chat</p>
              <p className="text-muted-foreground">Always up for a coffee in Auckland!</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Lightbulb className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-medium mb-2">Quick Tips</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Be specific about your project requirements</li>
                <li>• Include your timeline and budget expectations</li>
                <li>• Feel free to share any relevant links</li>
                <li>• Don&apos;t hesitate to ask about my experience</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}