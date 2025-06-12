"use client";
import Navbar from "../_component/Navbar";
import AboutCompany from "../_component/AboutCompany";
import Partner from "../_component/Partner";
import Partner2 from "../_component/Partner2";
import Company2 from "../_component/Company2";
import Footer from "../_component/Footer";
import Logos from "../_component/logos";
import Ourteam from "../_component/Ourteam";
import Ourteam2 from "../_component/Ourteam2";
import Team from "../_component/Team";
import Finance from "../_component/Finance";

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