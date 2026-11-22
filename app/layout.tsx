import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: "ARSA Events Portal | JSPM RSCOE Pune",
    template: "%s | ARSA Events Portal",
  },
  description:
    "Official events, workshops, hackathons, and registration portal of the Automation & Robotics Student Association (ARSA), Dept. of Automation & Robotics, JSPM's Rajarshi Shahu College of Engineering, Pune.",
  keywords: [
    "ARSA",
    "JSPM RSCOE",
    "Automation and Robotics",
    "Robotics Events Pune",
    "Hackathons Pune",
    "ROS2 Workshop",
    "ESP32 IoT Workshop",
    "Student Association",
    "Engineering Events",
  ],
  authors: [{ name: "ARSA Tech Team" }],
  openGraph: {
    title: "ARSA Events Portal | Dept. of Automation & Robotics, JSPM RSCOE",
    description: "Automate. Innovate. Build. Browse upcoming robotics workshops, hackathons, and register in one click.",
    type: "website",
    locale: "en_IN",
    siteName: "ARSA Events Portal",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col font-sans bg-canvas text-ink antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <Navbar />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
          <Toaster
            position="top-right"
            richColors
            toastOptions={{
              className: "font-sans text-xs border border-hairline bg-surface text-ink shadow-card",
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
