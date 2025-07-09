"use client";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaChevronRight,
  FaCalendarAlt,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { Link, OpenContact, ImportantDate } from "@/lib/generated/prisma";

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
type OpenContactWithLinks = OpenContact & {
  links: Link[];
  importantDates: ImportantDate[];
};
export default function Footer() {
  const [openContact, setOpenContact] = useState<OpenContactWithLinks | null>(
    null
  );

  useEffect(() => {
    const fetchOpenContacts = async () => {
      const openContacts = await fetch("/api/user/open-contacts");
      const data = await openContacts.json();
      // Since the API returns an array, take the first element
      setOpenContact(data[0] as OpenContactWithLinks);
    };
    fetchOpenContacts();
  }, []);

  if (!openContact) return null;

  return (
    <footer className="bg-[#007399] text-white pt-12 pb-4 px-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 justify-between">
        {/* Logo & About */}
        <div className="flex-1 min-w-[220px]">
          <div className="flex items-center mb-2">
            <span className="text-white text-5xl font-bold">G</span>
            <div>
              <span className="text-white text-4xl font-bold">audit</span>
              <div className="text-xs text-white tracking-widest">
                ACCOUNTING FIRM
              </div>
            </div>
          </div>
          <p className="mb-6 mt-4 text-white/90">
            Donec neque massa, faucibus nec lorem vitae feugiat pharetra sem.
            Nulla elementum eget lectus dapibus amatug mix finibus.
          </p>
          <div className="flex space-x-4 mt-6 flex-col">
            {openContact.links &&
              openContact.links.map((link) => (
                <a href={link.url} className="mb-2" key={link.id}>
                  {link.name}
                </a>
              ))}
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
              <div>{openContact.phone1}</div>
              <div>{openContact.phone2}</div>
            </div>
          </div>
          <div className="flex items-start mb-4">
            <FaEnvelope className="text-2xl mr-3 mt-1 text-[#00c6fb]" />
            <div>
              <div className="font-bold">Email</div>
              <div>{openContact.email}</div>
            </div>
          </div>
          <div className="flex items-start mb-4">
            <FaMapMarkerAlt className="text-2xl mr-3 mt-1 text-[#00c6fb]" />
            <div>
              <div className="font-bold">Address</div>
              <div>{openContact.address}</div>
            </div>
          </div>
          {/* Important Dates */}
          {openContact.importantDates &&
            openContact.importantDates.length > 0 && (
              <div className="flex items-start">
                <FaCalendarAlt className="text-2xl mr-3 mt-1 text-[#00c6fb]" />
                <div>
                  <div className="font-bold">Important Dates</div>
                  {openContact.importantDates.slice(0, 3).map((date) => (
                    <div key={date.id} className="text-sm">
                      <div className="font-medium">{date.title}</div>
                      <div className="text-white/80">
                        {new Date(date.date).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                  {openContact.importantDates.length > 3 && (
                    <div className="text-sm text-white/60">
                      +{openContact.importantDates.length - 3} more dates
                    </div>
                  )}
                </div>
              </div>
            )}
        </div>
      </div>
      <hr className="my-8 border-white/30" />
      <div className="text-center text-white/80 text-sm">
        Copyright 2025 © All Right Reserved Design by Accufin
      </div>
    </footer>
  );
}
