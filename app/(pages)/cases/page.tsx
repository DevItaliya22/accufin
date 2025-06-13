"use client";
import Navbar from "../_component/Navbar";
import AboutCompany from "../_component/AboutCompany";
import Partner from "../_component/Partner";
import About2 from "../_component/About2";
import Company2 from "../_component/Company2";
import Footer from "../_component/Footer";
import Logos from "../_component/logos";
import Ourteam from "../_component/Ourteam";
import Finance from "../_component/Finance";
import Finance2 from "../_component/Finance2";
import Finance3 from "../_component/Finance3";
import Cases from "../_component/Cases";
import BlogSection from "../_component/BlogSection";

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