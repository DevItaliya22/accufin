"use client";
import Navbar from "@/app/_component/Navbar";
import AboutCompany from "@/app/_component/AboutCompany";
import Partner from "@/app/_component/Partner";
import About2 from "@/app/_component/About2";
import Company2 from "@/app/_component/Company2";
import Footer from "@/app/_component/Footer";
import Logos from "@/app/_component/logos";
import Ourteam from "@/app/_component/Ourteam";

export default function AboutPage() {
    return (
        <div>
            <Navbar />
            <About2 />
            <AboutCompany />
            <Company2 />
            <Partner />
            <Logos />
            <Ourteam />
            <Footer />
        </div>
    );
}