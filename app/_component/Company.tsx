"use client";

import Link from "next/link";
import {
    FaBook,
    FaMoneyCheckAlt,
    FaCalculator,
    FaClipboardCheck,
    FaChartLine,
    FaUserCog,
    FaBriefcase,
    FaUserTie,
    FaChevronRight,
} from "react-icons/fa";

const services = [
    {
        icon: <FaBook className="text-3xl" />,
        title: "Bookkeeping",
        desc: "Proin laoreet nisi vitae et velunto phare mattis lorem tristiq.",
    },
    {
        icon: <FaMoneyCheckAlt className="text-3xl" />,
        title: "Payroll Services",
        desc: "Proin laoreet nisi vitae et velunto phare mattis lorem tristiq.",
    },
    {
        icon: <FaCalculator className="text-3xl" />,
        title: "Tax Planning",
        desc: "Proin laoreet nisi vitae et velunto phare mattis lorem tristiq.",
    },
    {
        icon: <FaClipboardCheck className="text-3xl" />,
        title: "Audit & Assurance",
        desc: "Proin laoreet nisi vitae et velunto phare mattis lorem tristiq.",
    },
    {
        icon: <FaChartLine className="text-3xl" />,
        title: "Financial Statement",
        desc: "Proin laoreet nisi vitae et velunto phare mattis lorem tristiq.",
    },
    {
        icon: <FaUserCog className="text-3xl" />,
        title: "Tech Consulting",
        desc: "Proin laoreet nisi vitae et velunto phare mattis lorem tristiq.",
    },
    {
        icon: <FaBriefcase className="text-3xl" />,
        title: "Business Advisory",
        desc: "Proin laoreet nisi vitae et velunto phare mattis lorem tristiq.",
    },
    {
        icon: <FaUserTie className="text-3xl" />,
        title: "Outsourced CFO",
        desc: "Proin laoreet nisi vitae et velunto phare mattis lorem tristiq.",
    },
];

export default function Company() {
    return (
        <section className="mt-15">
            {/* Our Company In Number with fixed background */}
            {/* <div
                className="relative w-full h-[320px] flex items-center"
                style={{
                    backgroundImage: "url('/img3.jpg')",
                    backgroundAttachment: "fixed",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                }}
            >
                <div className="absolute inset-0 bg-black opacity-40"></div>
                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between h-full">
                    <div className="text-white text-3xl sm:text-4xl font-bold mb-6 sm:mb-0">
                        Our Company <br /> In Number
                    </div>
                    <div className="flex flex-col sm:flex-row gap-8 text-white text-center">
                        <div>
                            <div className="text-3xl sm:text-4xl font-bold">
                                15<sup>th</sup>
                            </div>
                            <div className="font-semibold">Years Experience</div>
                        </div>
                        <div>
                            <div className="text-3xl sm:text-4xl font-bold">1,700+</div>
                            <div className="font-semibold">Happy Client</div>
                        </div>
                        <div>
                            <div className="text-3xl sm:text-4xl font-bold">4,300+</div>
                            <div className="font-semibold">Project Completed</div>
                        </div>
                    </div>
                </div>
            </div> */}
            <div className="bg-[#ffffff] py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-2 text-[#008db3] font-semibold tracking-widest uppercase">
                        Our Services
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-[#0a2236] text-center mb-4">
                        Real Accounting Services for You
                    </h2>
                    <p className="text-center text-[#5a6a7a] mb-10 max-w-2xl mx-auto">
                        Sed tincidunt accumsan lacus nec bibendum sapien aliquet ut suspendisse
                        pharetra. Finibus condimentum aenean lacinia sem metus Integer.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {services.map((service, idx) => {
                            const isFirst = idx === 0;
                            return (
                                <div
                                    key={service.title}
                                    className={`rounded-lg border border-[#008db3] transition-colors p-6 flex flex-col h-full group ${isFirst
                                        ? "bg-[#008db3] text-white hover:bg-[#007399]"
                                        : "bg-white text-[#0a2236] hover:bg-[#008db3] hover:text-white"
                                        }`}
                                >
                                    <div className="mb-4">{service.icon}</div>
                                    <div className="font-bold text-lg mb-2">{service.title}</div>
                                    <div className="mb-4 text-sm flex-1">{service.desc}</div>
                                    <Link
                                        href=""
                                        className="inline-flex items-center font-semibold text-sm transition-colors text-inherit group-hover:text-white"
                                    >
                                        READ MORE <FaChevronRight className="ml-2" />
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>        
        </section>
    );
}