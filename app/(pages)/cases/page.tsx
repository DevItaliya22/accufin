"use client";
import Navbar from "@/app/_component/Navbar";
import AboutCompany from "@/app/_component/AboutCompany";
import Partner from "@/app/_component/Partner";
import About2 from "@/app/_component/About2";
import Company2 from "@/app/_component/Company2";
import Footer from "@/app/_component/Footer";
import Logos from "@/app/_component/logos";
import Ourteam from "@/app/_component/Ourteam";
import Finance from "@/app/_component/Finance";
import Finance2 from "@/app/_component/Finance2";
import Finance3 from "@/app/_component/Finance3";
import Cases from "@/app/_component/Cases";
import BlogSection from "@/app/_component/BlogSection";

export default function CasesPage() {
    return (
        <div>
            <Navbar />
            <Cases />
            <Finance2 />
            <Finance3 />
            <Finance />
            <BlogSection/>
            <Footer />
        </div>
    );
}