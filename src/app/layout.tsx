import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/navbar";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Outfit } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Parin Kasabia Portfolio",
    absolute: "Parin Kasabia Portfolio",
  },
  description:
    "A simple portfolio website to showcase my projects and skills.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >

            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}