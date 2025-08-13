"use client";
import Navbar from "@/app/_component/Navbar";
import AboutCompany from "@/app/_component/AboutCompany";
import Partner from "@/app/_component/Partner";
import Company2 from "@/app/_component/Company2";
import Footer from "@/app/_component/Footer";
import Logos from "@/app/_component/logos";
import Ourteam from "@/app/_component/Ourteam";
import Service from "@/app/_component/Service";
import Company from "@/app/_component/Company";
import Finance from "@/app/_component/Finance";
import Price from "@/app/_component/Price";
import OurStages from "@/app/_component/OurStages";
import Pricing from "@/app/_component/Pricing";
import Partner2 from "@/app/_component/Partner2";

export default function PricingPage() {
    
    return (
        <div>
            <Navbar />
            <Pricing />
            <Price />
            <Finance/>
            <OurStages />
            <Partner2 />
            <Footer />
        </div>
    );
}