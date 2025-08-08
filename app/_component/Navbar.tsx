"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FaPhoneAlt, FaBars, FaCalendarAlt } from "react-icons/fa";
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
import { useSession } from "next-auth/react";
import ImportantDatesModal from "./ImportantDatesModal";
export default function NewHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  const { data: session } = useSession();
  const handleDropdownClick = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    {
      name: "Services",
      href: "/service",
      dropdown: [
        { name: "All Services", href: "/service" },
        // { name: "Service Details", href: "/servicedetail" },
        { name: "Bookkeeping", href: "/service/bookkeeping" },
        { name: "Payroll Services", href: "/service/payroll" },
        { name: "Tax Planning", href: "/service/tax" },
        { name: "Audit & Assurance", href: "/service/audit" },
        { name: "Financial Statement", href: "/service/finance" },
        { name: "Business Compliances", href: "/service/businesscompliances" },
      ],
    },
    {
      name: "Cases",
      href: "/cases",
      dropdown: [
        { name: "All Cases", href: "/cases" },
        { name: "Case Details", href: "/casedetail" },
      ],
    },
    {
      name: "Pages",
      href: "#",
      dropdown: [
        { name: "Pricing", href: "/pricing" },
        { name: "Team", href: "/team" },
        { name: "Blog", href: "/blog" },
        { name: "Single Post", href: "/singlepost" },
      ],
    },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="bg-[#007399]" ref={headerRef}>
      {/* Top Bar */}
      <div className="bg-[#f7f7f7] py-2 px-4 md:px-8">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-gray-600 text-sm">
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-cyan-400" />
              <span>8-3015 Trethewey Street, Abbotsford, BC, Canada</span>
            </div>
            <div className="flex items-center gap-2">
              <FaEnvelope className="text-cyan-400" />
              <span>info.accufin@gmail.com</span>
            </div>
          </div>
          <div className="flex gap-4">
            {[FaFacebookF, FaTwitter, FaInstagram, FaYoutube].map(
              (Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="bg-cyan-400 rounded-full w-9 h-9 flex items-center justify-center text-white text-lg hover:bg-cyan-500 transition-colors"
                >
                  <Icon />
                </a>
              )
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/image-000.png"
              alt="Accufin Logo"
              className="h-16 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {menuItems.map((item) => (
              <div key={item.name} className="relative">
                {item.dropdown ? (
                  <div>
                    <button
                      onClick={() => handleDropdownClick(item.name)}
                      className="text-white text-lg flex items-center gap-1 hover:text-cyan-200 transition-colors"
                    >
                      {item.name}
                      <RiArrowDropDownLine className="text-2xl" />
                    </button>
                    {activeDropdown === item.name && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-[#0082a3] rounded-lg shadow-lg py-2 z-50">
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className="block px-4 py-2 text-white hover:bg-cyan-700 transition-colors"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="text-white text-lg hover:text-cyan-200 transition-colors"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            {session ? (
              <Link
                href="/dashboard"
                className="text-white text-lg bg-cyan-600 hover:bg-cyan-700 px-6 py-2 rounded-lg transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-white text-lg bg-cyan-600 hover:bg-cyan-700 px-6 py-2 rounded-lg transition-colors"
              >
                Login
              </Link>
            )}
          </nav>

          {/* Contact Info - Desktop */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-3">
              <FaPhoneAlt className="text-white text-2xl" />
              <div>
                <div className="text-white text-sm">Call Us</div>
                <div className="text-white font-semibold">+1 604 551 3023</div>
              </div>
            </div>

            {/* Important Dates Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 text-white hover:text-cyan-200 transition-colors  bg-cyan-600 rounded-xl px-4 py-2 "
            >
              <FaCalendarAlt className="text-white text-xl" />
              <div>
                <div className="text-sm text-white">Important Dates</div>
                <div className="text-white font-semibold">View All</div>
                {/* <div className="text-[#44ff00] font-semibold">View All</div> */}
              </div>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-white text-2xl"
          >
            {isMenuOpen ? <IoMdClose /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-[#0082a3] px-4 py-4">
          <nav className="flex flex-col gap-4">
            {menuItems.map((item) => (
              <div key={item.name}>
                {item.dropdown ? (
                  <div>
                    <button
                      onClick={() => handleDropdownClick(item.name)}
                      className="text-white text-lg flex items-center gap-1 w-full"
                    >
                      {item.name}
                      <RiArrowDropDownLine className="text-2xl" />
                    </button>
                    {activeDropdown === item.name && (
                      <div className="pl-4 mt-2 space-y-2">
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className="block text-white hover:text-cyan-200"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="block text-white text-lg hover:text-cyan-200"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            <Link
              href="/login"
              className="text-white text-lg bg-cyan-600 hover:bg-cyan-700 px-6 py-2 rounded-lg inline-block text-center"
            >
              Login
            </Link>
          </nav>
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white">
            <FaPhoneAlt className="text-white text-2xl" />
            <div>
              <div className="text-white text-sm">Call Us</div>
              <div className="text-white font-semibold">+1 604 551 3023</div>
            </div>
          </div>

          {/* Important Dates Button - Mobile */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 text-white hover:text-cyan-200 transition-colors mt-4 pt-4 border-t border-white w-full"
          >
            <FaCalendarAlt className="text-white text-xl" />
            <div>
              <div className="text-white text-sm">Important Dates</div>
              <div className="text-white font-semibold">View All</div>
            </div>
          </button>
        </div>
      )}

      {/* Important Dates Modal */}
      <ImportantDatesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </header>
  );
}
