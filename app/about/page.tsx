"use client";
import Navbar from "../_component/Navbar";
import AboutCompany from "../_component/AboutCompany";
import Partner from "../_component/Partner";
import About2 from "../_component/About2";
import Company2 from "../_component/Company2";
import Footer from "../_component/Footer";
import Logos from "../_component/logos";
import Ourteam from "../_component/Ourteam";

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