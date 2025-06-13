"use client";
import Navbar from "@/app/_component/Navbar";
import AboutCompany from "@/app/_component/AboutCompany";
import Partner from "@/app/_component/Partner";
import Partner2 from "@/app/_component/Partner2";
import Company2 from "@/app/_component/Company2";
import Footer from "@/app/_component/Footer";
import Logos from "@/app/_component/logos";
import Ourteam from "@/app/_component/Ourteam";
import Ourteam2 from "@/app/_component/Ourteam2";
import Team from "@/app/_component/Team";
import Finance from "@/app/_component/Finance";

export default function TeamPage() {
    return (
        <div>
            <Navbar />
            <Team />
            <Ourteam />
            <Ourteam2 />
            <Finance/>
            <Partner />
            <Partner2 />            
            <Footer />
        </div>
    );
}