"use client";
import Navbar from "@/app/_component/Navbar";
import AboutCompany from "@/app/_component/AboutCompany";
import Partner from "@/app/_component/Partner";
import Partner2 from "@/app/_component/Partner2";
import Company2 from "@/app/_component/Company2";
import Footer from "@/app/_component/Footer";
import Blog from "@/app/_component/Blog";
import Finance from "@/app/_component/Finance";
import BlogSection from "@/app/_component/BlogSection";
import BlogSection2 from "@/app/_component/BlogSection2";
import BlogSection3 from "@/app/_component/BlogSection3";


export default function BlogPage() {
    return (
        <div>
            <Navbar />
            <Blog />
            <BlogSection3 />
            <Footer />
        </div>
    );
}