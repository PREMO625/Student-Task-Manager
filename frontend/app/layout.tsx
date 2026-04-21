import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "TaskFlow — Student Task Manager",
  description: "A modern productivity app that helps students organize assignments, track deadlines, and monitor progress. Stay on top of your academic life.",
  keywords: ["student", "task manager", "productivity", "assignments", "deadlines"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="noise-overlay">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
