import { ContactSubmissionData } from "@/features/portfolio/types/contact/types";

export async function submitContactForm(data: ContactSubmissionData) {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to send message");
  }

  return response.json();
}