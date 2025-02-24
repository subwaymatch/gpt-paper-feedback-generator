import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GPT Paper Feedback Generator",
  description:
    "Use OpenAI API to generate feedback for papers in doc, docx, and pdf formats.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
