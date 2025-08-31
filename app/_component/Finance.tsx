"use client";
import { useRef } from "react";
import { FaChartBar, FaMoneyCheckAlt, FaClipboardList } from "react-icons/fa";
import { motion, useInView } from "framer-motion";

const stages = [
    {
        icon: <FaChartBar className="text-3xl text-[#00c6fb]" />,
        title: "Consultation",
        desc: "Don't delay. We are just a phone call away",
    },
    {
        icon: <FaMoneyCheckAlt className="text-3xl text-[#00c6fb]" />,
        title: "Choose a Package",
        desc: "Compatible and very exclusive cost effective according to the business needs.",
    },
    {
        icon: <FaClipboardList className="text-3xl text-[#00c6fb]" />,
        title: "Get Your Service",
        desc: "A Bundled package along with all your business and individual/family taxes tailored to your requirements. We will help you to reduce your taxes legally in the best possible way.",
    },
];
const projects = [
    {
        img: "/img6.jpg",
        href:"/financialrestructuring",
        title: "Financial Restructuring",
        desc: "Nunc volutpat, tortor sit amet sagittis ef en sed tellus diam laoreet justo, et elementum odio nibh eget ligula dolor dui tempus.",
    },
    {
        img: "/img7.jpg",
        href: "/caseflow",
        title: "Cash Flow & Tax",
        desc: "Nunc volutpat, tortor sit amet sagittis ef en sed tellus diam laoreet justo, et elementum odio nibh eget ligula dolor dui tempus.",
    },
    {
        img: "/img8.jpg",
        href: "/inventory",
        title: "Inventory Management",
        desc: "Nunc volutpat, tortor sit amet sagittis ef en sed tellus diam laoreet justo, et elementum odio nibh eget ligula dolor dui tempus.",
    },
];


export default function Finance() {
    const topRef = useRef(null);
    const caseRef = useRef(null);
    const stageRef = useRef(null);

    const topInView = useInView(topRef, { once: true, margin: "0px 0px -100px 0px" });
    const caseInView = useInView(caseRef, { once: true, margin: "0px 0px -100px 0px" });
    const stageInView = useInView(stageRef, { once: true, margin: "0px 0px -100px 0px" });
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section>
            {/* Top Section with Fixed Background */}
            <motion.div
                ref={topRef}
                initial={{ opacity: 0, y: 60 }}
                animate={topInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative w-full h-[320px] flex flex-col items-center justify-center text-center"
                style={{
                    backgroundImage: "url('/img5.jpg')",
                    backgroundAttachment: "fixed",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                }}
            >
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="relative z-10 px-4">
                    <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">
                        Having Trouble Managing Your Finances?
                    </h2>
                    <p className="text-white text-base md:text-lg mb-6 max-w-2xl mx-auto">
                        Stop Guessing. Start Growing, Lets work together to make bookkeeping and accounting streamlined and hassle free.
                    </p>
                    <a
                        href="/contact"
                        className="inline-block bg-[#00c6fb] hover:bg-[#00a6d6] text-white font-semibold px-8 py-3 rounded transition-colors text-lg"
                    >
                        CONTACT US NOW &rarr;
                    </a>
                </div>
            </motion.div>

            {/* Case Studies */}
            <motion.div
                ref={caseRef}
                initial={{ opacity: 0, x: -60 }}
                animate={caseInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="bg-[#f7f9fa] py-16 px-4"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-2 text-[#008db3] font-semibold tracking-widest uppercase">
                        Case Studies
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-[#0a2236] text-center mb-4">
                        The Last Project We Worked On
                    </h2>
                    <p className="text-center text-[#5a6a7a] mb-10 max-w-2xl mx-auto">
                        Stop Guessing. Start Growing, Lets work together to make bookkeeping and accounting streamlined and hassle free.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <div
                                key={project.title}
                                className="rounded-lg border border-[#008db3] bg-white hover:bg-[#008db3] hover:text-white transition-colors p-0 flex flex-col h-full group"
                            >
                                <div className="overflow-hidden rounded-t-lg">
                                    <img
                                        src={project.img}
                                        alt={project.title}
                                        className="w-full h-48 object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                                    />
                                </div>
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="font-bold text-lg mb-2">{project.title}</div>
                                    {/* <div className="mb-4 text-sm flex-1">{project.desc}</div> */}
                                    <a
                                        href={project.href}
                                        className="inline-flex items-center font-semibold text-sm group-hover:text-white text-[#00c6fb] transition-colors"
                                    >
                                        READ MORE &rarr;
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
     

            {/* Our Stages */}
            {/* <motion.div
                ref={stageRef}
                initial={{ opacity: 0, x: 60 }}
                animate={stageInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="bg-[#f7f9fa] py-16 px-4"
            >
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10">
                    <div className="flex-1 flex flex-col gap-8">
                        {stages.map((stage) => (
                            <div key={stage.title} className="flex items-start gap-4">
                                <div>{stage.icon}</div>
                                <div>
                                    <div className="font-bold text-lg text-[#0a2236] mb-1">{stage.title}</div>
                                    <div className="text-[#5a6a7a] text-base">{stage.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex-1">
                        <div className="text-[#008db3] font-semibold tracking-widest mb-2 uppercase">
                            Our Stages
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#0a2236] mb-4">
                            Easy Process to Manage Your Finances
                        </h2>
                        <p className="text-[#5a6a7a] text-base">
                            In sed nisi vel tortor ornare venenatis sit amet vel felis. Etiam sit amet odio sed nunc lacinia dictum vel quis est. Vivamus in tempor dolor. Sed eget pharetra ligula. Etiam egestas fringilla lectus, et molestie augue auctor sagittis. Nunc sit amet felis ac ex ultricies lacinia. Praesent quis ligula id tortor maximus laoreet. Fusce ultrices sed ante sollicitudin venenatis. Suspendisse potenti. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.
                        </p>
                    </div>
                </div>
            </motion.div> */}
        </section>
    );
}
