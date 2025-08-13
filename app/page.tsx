import "./globals.css";
import Navbar from "./_component/Navbar";
import Hero from "./_component/Hero";
import AboutCompany from "./_component/AboutCompany";
import Company from "./_component/Company";
import Partner from "./_component/Partner";
import Partner2 from "./_component/Partner2";
import Finance from "./_component/Finance";
import Finance2 from "./_component/Finance2";
import Faq from "./_component/Faq";
import BlogSection from "./_component/BlogSection";
import Footer from "./_component/Footer";
import Logos from "./_component/logos";
import Company2 from "./_component/Company2";
import OurStages from "./_component/OurStages";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <AboutCompany />
      <Company2 />
      <Company />
      {/* <Logos /> */}
      <Partner />
      <Partner2 />
      <Finance />
      {/* <Finance2 /> */}
      {/* <OurStages/> */}
      <Faq />
      <BlogSection />
      <Footer />
    </main>
  );
}