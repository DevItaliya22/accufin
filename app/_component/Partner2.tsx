"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FaUserTie, FaPlane, FaBuilding, FaCheckCircle } from "react-icons/fa";

const partners = [
  "https://gtkit.rometheme.pro/gaudit/wp-content/uploads/sites/20/2023/03/Partner-1.png",
  "https://gtkit.rometheme.pro/gaudit/wp-content/uploads/sites/20/2023/03/Partner-4.png",
  "https://gtkit.rometheme.pro/gaudit/wp-content/uploads/sites/20/2023/03/Partner-3.png",
  "https://gtkit.rometheme.pro/gaudit/wp-content/uploads/sites/20/2023/03/Partner-2.png",
  "https://gtkit.rometheme.pro/gaudit/wp-content/uploads/sites/20/2023/03/Partner-6.png",
  "https://gtkit.rometheme.pro/gaudit/wp-content/uploads/sites/20/2023/03/Partner-5.png",
];

const testimonials = [
  {
    text: '"Etiam quis tincidunt este efficitu. Ipsum nunc bibendum ut risus et vehicula proin tempus auctor."',
    name: "Matthew Patel",
    role: "Businessman",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    text: '"Etiam quis tincidunt este efficitu. Ipsum nunc bibendum ut risus et vehicula proin tempus auctor."',
    name: "Danilla",
    role: "Air Hostess",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    text: '"Etiam quis tincidunt este efficitu. Ipsum nunc bibendum ut risus et vehicula proin tempus auctor."',
    name: "Jason Rando",
    role: "Company CEO",
    img: "https://randomuser.me/api/portraits/men/85.jpg",
  },
];

export default function Partner() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const directions = [
    { x: -80, y: 0 },
    { x: 0, y: 80 },
    { x: 80, y: 0 },
  ];

  return (
    <section ref={sectionRef} className="w-full">
      {/* Testimonials */}
      <div className="bg-white py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, ...directions[i % directions.length] }}
              animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.2, ease: "easeOut" }}
              className="bg-white bg-red-900 border border-[#0082a3] rounded-lg p-8 shadow-sm flex flex-col justify-between min-h-[220px]"
            >
              <p className="text-gray-500 italic mb-8">{t.text}</p>
              <div className="flex items-center mt-auto">
                <img src={t.img} alt={t.name} className="w-14 h-14 rounded-full mr-4" />
                <div>
                  <div className="font-bold text-lg text-gray-900">{t.name}</div>
                  <div className="text-[#0082a3] text-sm">{t.role}</div>
                </div>
                <span className="ml-auto text-[#0082a3] text-4xl rotate-180">&#10077;</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
