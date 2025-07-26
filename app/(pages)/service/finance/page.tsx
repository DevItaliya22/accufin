"use client";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FaChevronRight, FaCheck, FaTimes } from "react-icons/fa";
import Navbar from "@/app/_component/Navbar";
import Footer from "@/app/_component/Footer";
import Link from "next/link";

export default function FinancePage() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: "How long does preparation take?",
            a: "5-10 business days for standard packages after receiving complete data."
        },
        {
            q: "Can you handle complex consolidations?",
            a: "Yes—we specialize in multi-entity and small and mid-sized business needs."
        },
        {
            q: "What if I use spreadsheets, not accounting software?",
            a: "We provide templates and data conversion support."
        }
    ];
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    return (
        <div className="bg-white">
            <Navbar />
            <section
                className="relative w-full h-[320px] flex flex-col justify-center"
                style={{
                    backgroundImage: "url('/finance.jpg')",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                }}
                ref={ref}
            >
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col"
                >
                    <h1 className="text-white text-4xl md:text-5xl font-bold mb-4 mt-10">
                        Financial Statement Services
                    </h1>
                    <div className="flex items-center space-x-2 text-lg">
                        <Link href="/" className="text-[#00c6fb] hover:underline">Home</Link>
                        <span className="text-white">/</span>
                        <Link href="/services" className="text-[#00c6fb] hover:underline">Services</Link>
                        <span className="text-white">/</span>
                        <span className="text-white">Financial Statements</span>
                    </div>
                </motion.div>
            </section>

            {/* Hero Section */}
            <section className="max-w-7xl rounded-xl mx-auto bg-[#093961d2] relative mt-10  text-white pt-20 pb-10 px-4">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Financial Statement Services: Transform Your Numbers into Strategy
                    </h1>
                    <p className="text-xl mb-5 max-w-3xl mx-auto">
                        Beyond compliance. Clarity that drives growth. At Accufin, we prepare accurate, compliant financial statements that do more than meet regulatory requirements—they become your roadmap for smarter decisions.
                    </p>
                    {/* <Link
                        href="/contact"
                        className="inline-block bg-[#00c6fb] hover:bg-[#008db3] text-white font-bold py-3 px-8 rounded-lg transition duration-300"
                    >
                        Get Your Free Financial Health Check
                    </Link> */}
                </div>
            </section>

            {/* Why Financial Statements Matter */}
            <section className="max-w-7xl mx-auto px-4 py-16">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#0a2236] mb-6">
                        Why Financial Statements Matter
                    </h2>
                    <blockquote className="text-xl italic max-w-3xl mx-auto">
                        "Financial statements are your business's report card. They reveal profitability, expose risks, attract investors, and unlock financing. But only if they're prepared correctly for the Canadian context."
                    </blockquote>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-xl font-semibold text-[#0a2236] mb-4 flex items-center">
                            <FaTimes className="text-red-500 mr-2" />
                            DIY/Generic Statements
                        </h3>
                        <ul className="space-y-3 text-[#5a6a7a]">
                            <li className="flex items-start">
                                <FaTimes className="text-red-500 mr-2 mt-1 flex-shrink-0" />
                                <span>Risk of CRA compliance gaps</span>
                            </li>
                            <li className="flex items-start">
                                <FaTimes className="text-red-500 mr-2 mt-1 flex-shrink-0" />
                                <span>Missed trends & red flags</span>
                            </li>
                            <li className="flex items-start">
                                <FaTimes className="text-red-500 mr-2 mt-1 flex-shrink-0" />
                                <span>Generic templates</span>
                            </li>
                            <li className="flex items-start">
                                <FaTimes className="text-red-500 mr-2 mt-1 flex-shrink-0" />
                                <span>Delayed or inaccurate data</span>
                            </li>
                        </ul>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-xl font-semibold text-[#0a2236] mb-4 flex items-center">
                            <FaCheck className="text-green-500 mr-2" />
                            Our Professional Preparation
                        </h3>
                        <ul className="space-y-3 text-[#5a6a7a]">
                            <li className="flex items-start">
                                <FaCheck className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                                <span>Full ASPE/IFRS compliance</span>
                            </li>
                            <li className="flex items-start">
                                <FaCheck className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                                <span>Strategic insights & KPIs</span>
                            </li>
                            <li className="flex items-start">
                                <FaCheck className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                                <span>Tailored to your industry</span>
                            </li>
                            <li className="flex items-start">
                                <FaCheck className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                                <span>Timely, accurate reporting</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="bg-[#f8fafc] py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#0a2236] mb-12 text-center">
                        Our Canadian Financial Statement Services
                    </h2>

                    {/* Tailored Reporting Packages */}
                    <div className="mb-16">
                        <h3 className="text-2xl font-bold text-[#0a2236] mb-6 flex items-center">
                            <span className="text-2xl mr-3">📑</span>
                            Tailored Reporting Packages
                        </h3>

                        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                            <table className="min-w-full">
                                <thead className="bg-[#008db3] text-white">
                                    <tr>
                                        <th className="text-left py-4 px-6">Service Level</th>
                                        <th className="text-left py-4 px-6">Best For</th>
                                        <th className="text-left py-4 px-6">Key Deliverables</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    <tr className="hover:bg-gray-50">
                                        <td className="py-4 px-6 font-medium">Notice to Reader (Compilation)</td>
                                        <td className="py-4 px-6 text-[#5a6a7a]">Basic compliance, internal use</td>
                                        <td className="py-4 px-6 text-[#5a6a7a]">Simplified financial summary</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50">
                                        <td className="py-4 px-6 font-medium">Review Engagement</td>
                                        <td className="py-4 px-6 text-[#5a6a7a]">Lender requirements, mid-size businesses</td>
                                        <td className="py-4 px-6 text-[#5a6a7a]">Analytical procedures + limited assurance</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50">
                                        <td className="py-4 px-6 font-medium">Audited Statements</td>
                                        <td className="py-4 px-6 text-[#5a6a7a]">Regulatory compliance, investors, acquisitions</td>
                                        <td className="py-4 px-6 text-[#5a6a7a]">Full audit opinion + detailed disclosures</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Specialized Statements */}
                    <div>
                        <h3 className="text-2xl font-bold text-[#0a2236] mb-6 flex items-center">
                            <span className="text-2xl mr-3">📊</span>
                            Specialized Statements
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                                <ul className="space-y-3 text-[#5a6a7a]">
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span><strong>Management Discussion & Analysis (MD&A):</strong> Interpret results with forward-looking insights</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span><strong>Consolidated Financials:</strong> For groups or multiple entities</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                                <h4 className="font-semibold text-[#0a2236] mb-3">Industry-Specific Reports:</h4>
                                <ul className="space-y-2 text-[#5a6a7a]">
                                    <li className="flex items-start">
                                        <span className="mr-2">→</span>
                                        <span><strong>Real Estate:</strong> Project-level profitability, occupancy metrics</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">→</span>
                                        <span><strong>Manufacturing:</strong> Cost of production, inventory turnover</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">→</span>
                                        <span><strong>NFPs:</strong> Fund-restricted reporting, T3010 support</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Value We Deliver */}
            <section className="max-w-7xl mx-auto px-4 py-16">
                <h2 className="text-3xl md:text-4xl font-bold text-[#0a2236] mb-12 text-center">
                    The Value We Deliver
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                        <FaCheck className="text-2xl text-[#008db3] mb-4" />
                        <h3 className="text-xl font-semibold text-[#0a2236] mb-2">CRA-Compliant & Lender-Ready</h3>
                        <p className="text-[#5a6a7a]">Prepared under Canadian ASPE or IFRS standards—accepted by banks and regulators</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                        <FaCheck className="text-2xl text-[#008db3] mb-4" />
                        <h3 className="text-xl font-semibold text-[#0a2236] mb-2">Strategic Intelligence</h3>
                        <p className="text-[#5a6a7a]">Benchmarking, trend analysis, and KPIs that reveal growth opportunities</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                        <FaCheck className="text-2xl text-[#008db3] mb-4" />
                        <h3 className="text-xl font-semibold text-[#0a2236] mb-2">Time & Cost Savings</h3>
                        <p className="text-[#5a6a7a]">No more spreadsheet chaos. We handle data integration from your systems</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                        <FaCheck className="text-2xl text-[#008db3] mb-4" />
                        <h3 className="text-xl font-semibold text-[#0a2236] mb-2">Peace of Mind</h3>
                        <p className="text-[#5a6a7a]">CPA-reviewed accuracy with proactive error detection</p>
                    </div>
                </div>

                <blockquote className="text-xl italic text-center max-w-3xl mx-auto">
                    "We don't just report history—we help you write your future."
                </blockquote>
            </section>

            {/* Toolkit Section */}
            <section className="bg-[#f8fafc] py-16 px-4">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#0a2236] mb-8 text-center">
                        Your Financial Statement Toolkit
                    </h2>
                    <p className="text-center text-[#5a6a7a] mb-12 max-w-3xl mx-auto">
                        What You Receive:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
                            <h3 className="text-xl font-semibold text-[#0a2236] mb-2">Balance Sheet</h3>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
                            <h3 className="text-xl font-semibold text-[#0a2236] mb-2">Income Statement</h3>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
                            <h3 className="text-xl font-semibold text-[#0a2236] mb-2">Cash Flow Statement</h3>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
                            <h3 className="text-xl font-semibold text-[#0a2236] mb-2">Notes to Financials</h3>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
                            <h3 className="text-xl font-semibold text-[#0a2236] mb-2">Custom KPIs</h3>
                            <p className="text-[#5a6a7a]">(e.g., gross margin, ROI, liquidity ratios)</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
                            <h3 className="text-xl font-semibold text-[#0a2236] mb-2">Executive Summary</h3>
                            <p className="text-[#5a6a7a]">(plain-English insights)</p>
                        </div>
                    </div>

                    <p className="text-center mt-8 text-[#5a6a7a]">
                        + Bonus: Secure digital access via client portal.
                    </p>
                </div>
            </section>

            {/* Who We Serve */}
            <section className="max-w-7xl mx-auto px-4 py-16">
                <h2 className="text-3xl md:text-4xl font-bold text-[#0a2236] mb-12 text-center">
                    Who We Serve
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
                        <h3 className="text-xl font-semibold text-[#0a2236] mb-2">Startups</h3>
                        <p className="text-[#5a6a7a]">Investor-ready financials for seed rounds</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
                        <h3 className="text-xl font-semibold text-[#0a2236] mb-2">SMEs</h3>
                        <p className="text-[#5a6a7a]">Monthly/quarterly packages for active management</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
                        <h3 className="text-xl font-semibold text-[#0a2236] mb-2">Corporations</h3>
                        <p className="text-[#5a6a7a]">Year-end statements for shareholders</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
                        <h3 className="text-xl font-semibold text-[#0a2236] mb-2">Non-Profits</h3>
                        <p className="text-[#5a6a7a]">T3010-compliant charitable reporting</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
                        <h3 className="text-xl font-semibold text-[#0a2236] mb-2">Professionals</h3>
                        <p className="text-[#5a6a7a]">Medical/dental practice performance dashboards</p>
                    </div>
                </div>
            </section>

            {/* Our Process */}
            <section className="bg-gradient-to-r from-[#008db3] to-[#0a2236] text-white py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
                        Our Process: Simple & Collaborative
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm text-center">
                            <div className="bg-white text-[#008db3] rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
                            <h3 className="text-xl font-semibold mb-2">Data Sync</h3>
                            <p>Connect your accounting software (or share files securely)</p>
                        </div>
                        <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm text-center">
                            <div className="bg-white text-[#008db3] rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
                            <h3 className="text-xl font-semibold mb-2">Analysis & Preparation</h3>
                            <p>We reconcile, analyze, and draft statements</p>
                        </div>
                        <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm text-center">
                            <div className="bg-white text-[#008db3] rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
                            <h3 className="text-xl font-semibold mb-2">Review & Refine</h3>
                            <p>Collaborative session to explain findings</p>
                        </div>
                        <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm text-center">
                            <div className="bg-white text-[#008db3] rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
                            <h3 className="text-xl font-semibold mb-2">Delivery & Support</h3>
                            <p>Receive final statements + 30-min strategy debrief</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-7xl mx-auto px-4 py-16">
                <div className="bg-white rounded-xl shadow-xl p-8 md:p-12 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#0a2236] mb-6">
                        Ready for Financial Clarity?
                    </h2>
                    <div className="flex items-center justify-center text-[#008db3] mb-6">
                        <FaChevronRight className="mr-2" />
                        <span className="font-semibold">Limited Offer: Free Financial Health Check</span>
                    </div>
                    <p className="mb-8 max-w-2xl mx-auto">
                        We'll analyze your latest statements and identify:
                    </p>
                    <ul className="space-y-2 mb-8 max-w-md mx-auto text-left">
                        <li className="flex items-center">
                            <FaChevronRight className="mr-2 text-sm" />
                            3 opportunities to improve profitability
                        </li>
                        <li className="flex items-center">
                            <FaChevronRight className="mr-2 text-sm" />
                            1 critical compliance risk
                        </li>
                        <li className="flex items-center">
                            <FaChevronRight className="mr-2 text-sm" />
                            Custom reporting package recommendation
                        </li>
                    </ul>
                    {/* <Link
                        href="/contact"
                        className="inline-block bg-[#00c6fb] hover:bg-[#008db3] text-white font-bold py-3 px-8 rounded-lg transition duration-300"
                    >
                        Claim Your Free Assessment
                    </Link> */}
                </div>
            </section>

            {/* Trust Builders */}
            <section className="max-w-7xl mx-auto px-4 py-16">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
                    <div className="text-center md:text-left">
                        <p className="text-2xl font-bold text-[#0a2236]">1,200+ financial statements prepared</p>
                        <p className="text-xl text-[#5a6a7a]">98% client retention</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
                        <p className="text-sm text-[#5a6a7a] italic mb-2">Authority Note:</p>
                        <p className="font-semibold text-[#0a2236]">"Founded by Sanjeev Garg, Accountant and bookkeeper with 6+ years specializing in Canadian financial reporting."</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
                    <p className="text-sm text-[#5a6a7a] italic text-center">
                        *Financial statement services do not include audit or assurance unless specified. Past performance not indicative of future results.
                    </p>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="max-w-4xl mx-auto px-4 py-16">
                <h2 className="text-3xl font-bold text-[#0a2236] mb-8 text-center">
                    Frequently Asked Questions
                </h2>

                <div className="space-y-4">
                    {faqs.map((item, index) => {
                        const isOpen = openFaq === index;
                        return (
                            <div key={index} className="border-b border-gray-200 pb-4">
                                <button
                                    className="w-full flex justify-between items-center text-left font-semibold text-lg py-4 focus:outline-none"
                                    onClick={() => setOpenFaq(isOpen ? null : index)}
                                >
                                    <span>{item.q}</span>
                                    <FaChevronRight className={`ml-2 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                                </button>
                                <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 pb-4' : 'max-h-0'}`}>
                                    <p className="text-[#5a6a7a]">{item.a}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            <Footer />
        </div>
    );
}