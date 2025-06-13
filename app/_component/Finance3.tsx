import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FaChartBar, FaMoneyCheckAlt, FaClipboardList } from "react-icons/fa";

const projects = [
    {
        img: "/img6.jpg",
        title: "Financial Restructuring",
        desc: "Nunc volutpat, tortor sit amet sagittis ef en sed tellus diam laoreet justo, et elementum odio nibh eget ligula dolor dui tempus.",
    },
    {
        img: "/img7.jpg",
        title: "Cash Flow & Tax",
        desc: "Nunc volutpat, tortor sit amet sagittis ef en sed tellus diam laoreet justo, et elementum odio nibh eget ligula dolor dui tempus.",
    },
    {
        img: "/img8.jpg",
        title: "Inventory Management",
        desc: "Nunc volutpat, tortor sit amet sagittis ef en sed tellus diam laoreet justo, et elementum odio nibh eget ligula dolor dui tempus.",
    },
];

const stages = [
    {
        icon: <FaChartBar className="text-3xl text-[#00c6fb]" />,
        title: "Consultation",
        desc: "Elitam quis tincidunt est et efficitur ipsum nunc mixue. Bibendum ut risus et nec vehicula.",
    },
    {
        icon: <FaMoneyCheckAlt className="text-3xl text-[#00c6fb]" />,
        title: "Choose a Package",
        desc: "Elitam quis tincidunt est et efficitur ipsum nunc mixue. Bibendum ut risus et nec vehicula.",
    },
    {
        icon: <FaClipboardList className="text-3xl text-[#00c6fb]" />,
        title: "Get Your Service",
        desc: "Elitam quis tincidunt est et efficitur ipsum nunc mixue. Bibendum ut risus et nec vehicula.",
    },
];

export default function Finance() {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    const animations = [
        { x: -100, opacity: 0 },
        { y: 100, opacity: 0 },
        { x: 100, opacity: 0 },
    ];

    return (
        <section ref={sectionRef}>
            <div className="bg-[#f7f9fa] py-0 pb-10 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {projects.map((project, index) => (
                            <motion.div
                                key={project.title}
                                initial={animations[index]}
                                animate={isInView ? { x: 0, y: 0, opacity: 1 } : {}}
                                transition={{ duration: 0.6, delay: index * 0.2, ease: "easeOut" }}
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
                                    <div className="mb-4 text-sm flex-1">{project.desc}</div>
                                    <a
                                        href=""
                                        className="inline-flex items-center font-semibold text-sm group-hover:text-white text-[#00c6fb] transition-colors"
                                    >
                                        READ MORE &rarr;
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
