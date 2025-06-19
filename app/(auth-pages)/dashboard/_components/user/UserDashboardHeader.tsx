import { useState, useRef, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { Button } from "@/components/ui/button";

interface MenuItem {
  key: string;
  label: string;
}

interface UserDashboardHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

const menuItems: MenuItem[] = [
  { key: "upload", label: "Upload & My Files" },
  { key: "responses", label: "Admin Responses" },
  { key: "forms", label: "Forms" },
  { key: "notifications", label: "Notifications" },
  { key: "profile", label: "Profile" },
];

export default function UserDashboardHeader({
  activeTab,
  onTabChange,
  onLogout,
}: UserDashboardHeaderProps) {
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
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-white text-5xl font-bold">G</span>
            <div>
              <span className="text-white text-4xl font-bold">audit</span>
              <div className="text-xs text-white tracking-widest">
                USER DASHBOARD
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => onTabChange(item.key)}
                className={`text-white text-lg px-4 py-2 rounded-lg transition-colors ${
                  activeTab === item.key
                    ? "bg-cyan-600 hover:bg-cyan-700"
                    : "hover:text-cyan-200"
                }`}
              >
                {item.label}
              </button>
            ))}
            <span className="text-white text-sm ml-4">User Dashboard</span>
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
                className={`block text-white text-lg px-4 py-2 rounded-lg text-left transition-colors ${
                  activeTab === item.key
                    ? "bg-cyan-600 hover:bg-cyan-700"
                    : "hover:text-cyan-200"
                }`}
              >
                {item.label}
              </button>
            ))}
            <span className="text-white text-sm mt-2">User Dashboard</span>
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
