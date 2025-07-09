"use client";
import { useState, useRef, useEffect } from "react";
import { FaBars, FaPhoneAlt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { RiArrowDropDownLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";

interface MenuItem {
  key: string;
  label: string;
  icon?: React.ElementType;
}

interface DashboardHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

const menuItems: MenuItem[] = [
  { key: "users", label: "Users" },
  { key: "files", label: "File Management" },
  { key: "notifications", label: "Notifications" },
  { key: "blogs", label: "Blogs" },
  { key: "contacts", label: "Site Settings" },
  { key: "forms", label: "Forms" },
  { key: "profile", label: "Profile" },
];

export default function DashboardHeader({
  activeTab,
  onTabChange,
  onLogout,
}: DashboardHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-[#007399]" ref={headerRef}>
      {/* Main Navigation */}
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img
              src="/image-000.png"
              alt="Accufin Logo"
              className="h-16 w-auto"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => onTabChange(item.key)}
                className={`text-white text-lg px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                  activeTab === item.key
                    ? "bg-cyan-600 hover:bg-cyan-500"
                    : "hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="ml-2"
            >
              Logout
            </Button>
          </nav>

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
              <button
                key={item.key}
                onClick={() => {
                  onTabChange(item.key);
                  setIsMenuOpen(false);
                }}
                className={`block text-white text-lg px-4 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                  activeTab === item.key
                    ? "bg-cyan-600 hover:bg-cyan-500"
                    : "hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="mt-2"
            >
              Logout
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
