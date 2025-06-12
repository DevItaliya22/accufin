"use client";
import { useState } from "react";
import { FaPhoneAlt, FaBars } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import {
    FaMapMarkerAlt,
    FaEnvelope,
    FaFacebookF,
    FaTwitter,
    FaInstagram,
    FaYoutube,
} from "react-icons/fa";
import { RiArrowDropDownLine } from "react-icons/ri";
import Link from "next/link";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [casesDropdown, setCasesDropdown] = useState(false);
    const [pagesDropdown, setPagesDropdown] = useState(false);
    const [servicesDropdown, setServicesDropdown] = useState(false);

    return (
        <header className="bg-[#007399] py-0 m-0 relative z-10">
            {/* Top Bar */}
            <div className="bg-[#f7f7f7] w-full py-2 px-[5%]">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-0">
                    {/* Address & Email */}
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-8 text-gray-600 text-sm text-center sm:text-left">
                        <div className="flex items-center space-x-2">
                            <FaMapMarkerAlt className="text-cyan-400" />
                            <span>99 Roving St., Big City, PKU 23456</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <FaEnvelope className="text-cyan-400" />
                            <span>hello@awesomesite.com</span>
                        </div>
                    </div>

                    {/* Social Icons */}
                    <div className="flex items-center space-x-4 ">
                        <a href="#" className="bg-cyan-400 rounded-full w-9 h-9 flex items-center justify-center text-white text-lg">
                            <FaFacebookF />
                        </a>
                        <a href="#" className="bg-cyan-400 rounded-full w-9 h-9 flex items-center justify-center text-white text-lg">
                            <FaTwitter />
                        </a>
                        <a href="#" className="bg-cyan-400 rounded-full w-9 h-9 flex items-center justify-center text-white text-lg">
                            <FaInstagram />
                        </a>
                        <a href="#" className="bg-cyan-400 rounded-full w-9 h-9 flex items-center justify-center text-white text-lg">
                            <FaYoutube />
                        </a>
                    </div>
                </div>
            </div>


            {/* Main Navigation */}
            <div className="container mx-auto flex items-center justify-between py-5 lg:px-[5%] relative z-10">
                {/* Logo */}
                <div className="flex items-center space-x-2">
                    <span className="text-white text-5xl font-bold">G</span>
                    <div>
                        <span className="text-white text-4xl font-bold">audit</span>
                        <div className="text-xs text-white tracking-widest">ACCOUNTING FIRM</div>
                    </div>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex space-x-10 h-12 items-center relative">
                    <a href="/" className="text-white text-lg hover:underline">Home</a>
                    <Link href="/about" className="text-white text-lg hover:underline">About Us</Link>

                    {/* Services Dropdown */}
                    <div
                        className="relative h-full flex items-center"
                        onMouseEnter={() => setServicesDropdown(true)}
                        onMouseLeave={() => setServicesDropdown(false)}
                    >
                        <button className="text-white text-lg flex items-center px-4 py-2 transition hover:text-cyan-200 hover:bg-[#0082a3]">
                            Services
                            <RiArrowDropDownLine className="ml-1 text-[#00B6D6] text-2xl" />
                        </button>
                        {servicesDropdown && (
                            <div className="absolute top-full left-0 w-48 bg-[#0082a3] rounded-lg shadow-lg z-50">
                                <Link href="/service" className="block px-6 py-3 text-white hover:bg-cyan-700">Services</Link>
                                <Link href="/servicedetail" className="block px-6 py-3 text-white hover:bg-cyan-700">Service Detail</Link>
                            </div>
                        )}
                    </div>

                    {/* Pages Dropdown */}
                    <div
                        className="relative h-full flex items-center"
                        onMouseEnter={() => setPagesDropdown(true)}
                        onMouseLeave={() => setPagesDropdown(false)}
                    >
                        <button className="text-white text-lg flex items-center px-4 py-2 transition hover:text-cyan-200 hover:bg-[#0082a3]">
                            Pages
                            <RiArrowDropDownLine className="ml-1 text-[#00B6D6] text-2xl" />
                        </button>
                        {pagesDropdown && (
                            <div className="absolute top-full left-0 w-48 bg-[#0082a3] rounded-lg shadow-lg z-50">
                                <a href="/pricing" className="block px-6 py-3 text-white hover:bg-cyan-700">Pricing</a>
                                <a href="/team" className="block px-6 py-3 text-white hover:bg-cyan-700">Team</a>
                                {/* <a href="#" className="block px-6 py-3 text-white hover:bg-cyan-700">FAQs</a> */}
                                <a href="/blog" className="block px-6 py-3 text-white hover:bg-cyan-700">Blog</a>
                                <a href="/singlepost" className="block px-6 py-3 text-white hover:bg-cyan-700">Single Post</a>
                                {/* <a href="#" className="block px-6 py-3 text-white hover:bg-cyan-700">404 Error</a> */}
                            </div>
                        )}
                    </div>

                    {/* Cases Dropdown */}
                    <div
                        className="relative h-full flex items-center"
                        onMouseEnter={() => setCasesDropdown(true)}
                        onMouseLeave={() => setCasesDropdown(false)}
                    >
                        <button className="text-white text-lg flex items-center px-4 py-2 transition hover:text-cyan-200 hover:bg-[#0082a3]">
                            Cases
                            <RiArrowDropDownLine className="ml-1 text-[#00B6D6] text-2xl" />
                        </button>
                        {casesDropdown && (
                            <div className="absolute top-full left-0 w-48 bg-[#0082a3] rounded-lg shadow-lg z-50">
                                <a href="/cases" className="block px-6 py-3 text-white hover:bg-cyan-700">Cases</a>
                                <a href="/casedetail" className="block px-6 py-3 text-white hover:bg-cyan-700">Case Detail</a>
                            </div>
                        )}
                    </div>

                    <a href="/contact" className="text-white text-lg hover:underline">Contact Us</a>
                </nav>

                {/* Call Us */}
                <div className="hidden lg:flex items-center space-x-2">
                    <FaPhoneAlt className="text-white text-3xl" />
                    <div>
                        <div className="text-white text-xl font-bold">Call Us</div>
                        <div className="text-white text-lg">+123-234-1234</div>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <div className="lg:hidden">
                    <button onClick={() => setMenuOpen(!menuOpen)} className="text-white text-3xl">
                        {menuOpen ? <IoMdClose /> : <FaBars />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {menuOpen && (
                <div className="lg:hidden bg-[#007399] px-4 pt-4 pb-6 space-y-3">
                    <a href="/" className="block text-white text-lg hover:underline">Home</a>
                    <a href="#" className="block text-white text-lg hover:underline">About Us</a>
                    <a href="#" className="block text-white text-lg hover:underline">Services</a>
                    <a href="#" className="block text-white text-lg hover:underline">Cases</a>
                    <a href="#" className="block text-white text-lg hover:underline">Pages</a>
                    <a href="#" className="block text-white text-lg hover:underline">Contact Us</a>
                    <div className="flex items-center space-x-2 pt-4 border-t border-white mt-4">
                        <FaPhoneAlt className="text-white text-2xl" />
                        <div>
                            <div className="text-white font-bold">Call Us</div>
                            <div className="text-white">+123-234-1234</div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}