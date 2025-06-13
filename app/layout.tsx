import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./_component/Navbar";
import Hero from "./_component/Hero";
import AboutCompany from "./_component/AboutCompany";
import Company from "./_component/Company";
import Partner from "./_component/Partner";
import Finance from "./_component/Finance";
import Faq from "./_component/Faq";
import BlogSection from "./_component/BlogSection";
import Footer from "./_component/Footer";
import Logos from "./_component/logos";
import { Toaster } from "react-hot-toast";
import { Providers } from "@/lib/provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AccuFin - Financial Management Solutions",
  description:
    "Your trusted partner in financial management and accounting solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <Navbar />
        <Hero />
        <AboutCompany />
        <Company />
        <Logos />
        <Partner />
        <Finance />
        <Faq />
        <BlogSection />
        <Footer /> */}
        <Toaster />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
