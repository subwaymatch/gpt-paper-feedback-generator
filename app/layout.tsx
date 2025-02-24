import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

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
      <body className={`font-inter tracking-tight antialiased`}>
        {children}
      </body>
    </html>
  );
}
