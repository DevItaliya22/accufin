"use client";
import Navbar from "../_component/Navbar";
import AboutCompany from "../_component/AboutCompany";
import Partner from "../_component/Partner";
import Partner2 from "../_component/Partner2";
import Company2 from "../_component/Company2";
import Footer from "../_component/Footer";
import Blog from "../_component/Blog";
import Finance from "../_component/Finance";
import BlogSection from "../_component/BlogSection";
import BlogSection2 from "../_component/BlogSection2";

export default function BlogPage() {
    return (
        <div>
            <Navbar />
            <Blog />
            <BlogSection />
            <BlogSection2 />
            <Finance />
            <Footer />
        </div>
    );
}