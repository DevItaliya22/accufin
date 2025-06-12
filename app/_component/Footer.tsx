import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaChevronRight } from "react-icons/fa";

const quickLinks = [
    "Home",
    "About Us",
    "Services",
    "Cases",
    "Pricing",
    "FAQs",
    "Contact Us",
];

const services = [
    "Bookkeeping",
    "Payroll Services",
    "Tax Planning",
    "Audit & Assurance",
    "Financial Statement",
    "Tech Consulting",
    "Business Advisory",
    "Outsourced CFO",
];

export default function Footer() {
    return (
        <footer className="bg-[#007399] text-white pt-12 pb-4 px-4">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 justify-between">
                {/* Logo & About */}
                <div className="flex-1 min-w-[220px]">
                    <div className="flex items-center mb-2">
                        <span className="text-white text-5xl font-bold">G</span>
                        <div>
                            <span className="text-white text-4xl font-bold">audit</span>
                            <div className="text-xs text-white tracking-widest">ACCOUNTING FIRM</div>
                        </div>
                    </div>
                    <p className="mb-6 mt-4 text-white/90">
                        Donec neque massa, faucibus nec lorem vitae feugiat pharetra sem. Nulla elementum eget lectus dapibus amatug mix finibus.
                    </p>
                    <div className="flex space-x-4 mt-6">
                        <a href="" className="bg-[#00c6fb] hover:translate-y-[-6px] transition-transform rounded-full p-3">
                            <FaFacebookF className="text-2xl" />
                        </a>
                        <a href="" className="bg-[#00c6fb] hover:translate-y-[-6px] transition-transform rounded-full p-3">
                            <FaTwitter className="text-2xl" />
                        </a>
                        <a href="" className="bg-[#00c6fb] hover:translate-y-[-6px] transition-transform rounded-full p-3">
                            <FaInstagram className="text-2xl" />
                        </a>
                        <a href="" className="bg-[#00c6fb] hover:translate-y-[-6px] transition-transform rounded-full p-3">
                            <FaYoutube className="text-2xl" />
                        </a>
                    </div>
                </div>
                {/* Quick Links */}
                <div className="flex-1 min-w-[180px]">
                    <div className="font-bold text-2xl mb-4">Quick Links</div>
                    <ul>
                        {quickLinks.map((link) => (
                            <li key={link}>
                                <a
                                    href=""
                                    className="flex items-center py-1 hover:text-[#00c6fb] transition-colors"
                                >
                                    <FaChevronRight className="mr-2 text-[#00c6fb]" />
                                    {link}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
                {/* Services */}
                <div className="flex-1 min-w-[200px]">
                    <div className="font-bold text-2xl mb-4">Services</div>
                    <ul>
                        {services.map((service) => (
                            <li key={service}>
                                <a
                                    href=""
                                    className="flex items-center py-1 hover:text-[#00c6fb] transition-colors"
                                >
                                    <FaChevronRight className="mr-2 text-[#00c6fb]" />
                                    {service}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
                {/* Information */}
                <div className="flex-1 min-w-[220px]">
                    <div className="font-bold text-2xl mb-4">Information</div>
                    <div className="flex items-start mb-4">
                        <FaPhoneAlt className="text-2xl mr-3 mt-1 text-[#00c6fb]" />
                        <div>
                            <div className="font-bold">Phone</div>
                            <div>+123-234-1234</div>
                        </div>
                    </div>
                    <div className="flex items-start mb-4">
                        <FaEnvelope className="text-2xl mr-3 mt-1 text-[#00c6fb]" />
                        <div>
                            <div className="font-bold">Email</div>
                            <div>hello@awesomesite.com</div>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <FaMapMarkerAlt className="text-2xl mr-3 mt-1 text-[#00c6fb]" />
                        <div>
                            <div className="font-bold">Address</div>
                            <div>99 Roving St., Big City, PKU 23456</div>
                        </div>
                    </div>
                </div>
            </div>
            <hr className="my-8 border-white/30" />
            <div className="text-center text-white/80 text-sm">
                Copyright 2023 © All Right Reserved Design by Rometheme
            </div>
        </footer>
    );
}