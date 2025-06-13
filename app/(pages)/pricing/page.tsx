"use client";
import Navbar from "../_component/Navbar";
import AboutCompany from "../_component/AboutCompany";
import Partner from "../_component/Partner";
import Company2 from "../_component/Company2";
import Footer from "../_component/Footer";
import Logos from "../_component/logos";
import Ourteam from "../_component/Ourteam";
import Service from "../_component/Service";
import Company from "../_component/Company";
import Finance from "../_component/Finance";
import Price from "../_component/Price";
import OurStages from "../_component/OurStages";
import Pricing from "../_component/Pricing";
import Partner2 from "../_component/Partner2";

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