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

  return (
    <section ref={sectionRef} className="w-full">
      {/* Why Choose Us & Experience */}
      <div className="bg-[#ffffff] py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left: Text & Stats */}
          <motion.div
            initial={{ opacity: 0, x: -80, y: 20 }}
            animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="uppercase text-xs tracking-widest text-[#0082a3] mb-2">Why Choose Us</div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">Accounting With Unity</h3>
            <p className="text-gray-500 mb-6 text-sm md:text-base">
              Proin lorem nisl vitae pharetra mattis. Etiam luctus suscipit velit vitae ultricies malesuada. Augue molestie at aliquam quis tincidunt est, et efficitur turpis nunc bibendum ut risus et vehicula proin tempus tellus diam laoreet justo est tempus.
            </p>
            <div className="flex gap-8 mb-6 flex-col sm:flex-row">
              <div className="flex items-start gap-3">
                <FaCheckCircle className="text-[#0082a3] text-2xl mt-1" />
                <div>
                  <div className="font-semibold text-gray-900">Experienced</div>
                  <div className="text-gray-500 text-xs">Etiam luctus suscipit velit nec ultricies augue sed males.</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaCheckCircle className="text-[#0082a3] text-2xl mt-1" />
                <div>
                  <div className="font-semibold text-gray-900">Free Consultation</div>
                  <div className="text-gray-500 text-xs">Etiam luctus suscipit velit nec ultricies augue sed males.</div>
                </div>
              </div>
            </div>
            {/* Progress Bars */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                  <span>Expertise</span>
                  <span>95%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#0082a3] h-2 rounded-full" style={{ width: "95%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                  <span>Reputation</span>
                  <span>93%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#0082a3] h-2 rounded-full" style={{ width: "93%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                  <span>Knowledge</span>
                  <span>97%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#0082a3] h-2 rounded-full" style={{ width: "97%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                  <span>Communication</span>
                  <span>91%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#0082a3] h-2 rounded-full" style={{ width: "91%" }}></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Image & Experience */}
          <motion.div
            initial={{ opacity: 0, x: 80, y: -20 }}
            animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative flex justify-center items-center"
          >
            <img
              src="https://gtkit.rometheme.pro/gaudit/wp-content/uploads/sites/20/2023/03/Why-Choose-Us-Image.jpg"
              alt="Team"
              className="rounded-lg w-full max-w-md object-cover"
            />
            <div className="absolute -bottom-8 left-[-20%] translate-x-1/2 bg-[#0082a3] text-white rounded-lg px-8 py-4 shadow-lg flex flex-col items-center">
              <div className="text-2xl font-bold">15 <sup className="text-base">Th</sup></div>
              <div className="text-xs uppercase tracking-widest">Years Experience</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
