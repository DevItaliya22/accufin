"use client";
import Image from "next/image";
import { FaUserTie, FaPlane, FaBuilding, FaCheckCircle } from "react-icons/fa";

const partners = [
    "https://gtkit.rometheme.pro/gaudit/wp-content/uploads/sites/20/2023/03/Partner-1.png",
    "https://gtkit.rometheme.pro/gaudit/wp-content/uploads/sites/20/2023/03/Partner-4.png",
    "https://gtkit.rometheme.pro/gaudit/wp-content/uploads/sites/20/2023/03/Partner-3.png",
    "https://gtkit.rometheme.pro/gaudit/wp-content/uploads/sites/20/2023/03/Partner-2.png",
    "https://gtkit.rometheme.pro/gaudit/wp-content/uploads/sites/20/2023/03/Partner-6.png",
    "https://gtkit.rometheme.pro/gaudit/wp-content/uploads/sites/20/2023/03/Partner-5.png",
];

export default function Logos() {
    return (
        <div className="bg-[#0082a3] text-white py-10 px-4 ">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                {/* Logos */}
                <div className="flex-1 flex flex-wrap gap-8 justify-center md:justify-end items-center">
                    {partners.map((src, i) => (
                        <div key={i} className="w-40 h-15 flex items-center justify-center rounded">
                            <img src={src} alt="partner logo" className="h-full w-full object-contain" />
                        </div>
                    ))}
                </div>
                {/* Text */}
                <div className="flex-1 flex flex-col items-center md:items-start ">
                    <div className="uppercase text-xs tracking-widest text-cyan-200 mb-1">Partner</div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white text-center md:text-right">Get to Know Our</h2>
                    <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white text-center md:text-right">Partners</h2>
                    <p className="text-cyan-100 text-sm md:text-base max-w-md">
                        Aenean malesuada, elit non dictum sodales erat, et ultricies quam nunc bibendum et. Mauris vehicula porta erat magna.
                    </p>
                </div>
            </div>
        </div>)
};