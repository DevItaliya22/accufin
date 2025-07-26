"use client";
import { motion, useInView } from "framer-motion";
import { useState, useRef } from "react";
import { FaPlay, FaChevronRight } from "react-icons/fa";

const YOUTUBE_URL = "https://www.youtube.com/embed/VhBl3dHT5SY?autoplay=1";

export default function AboutCompany() {
  const [showVideo, setShowVideo] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      ref={ref}
      className="bg-[#FFFFFF] pb-12 px-4"
    >
      <div className="max-w-[85rem] mx-auto flex flex-col lg:flex-row gap-20 items-center">
        {/* Images */}
        <div className="relative flex-shrink-0 w-full lg:w-[420px]">
          <img
            src="/img1.jpg"
            alt="Team"
            className="rounded-2xl w-full object-cover"
          />
          <div className="absolute right-[-10%] bottom-[-70px] w-[260px] sm:w-[320px]">
            <div className="relative">
              <img
                src="/img2.jpg"
                alt="Video"
                className="rounded-xl w-full object-cover shadow-lg"
              />
              <button
                onClick={() => setShowVideo(true)}
                className="absolute inset-0 flex items-center justify-center"
                aria-label="Play Video"
              >
                <span className="bg-[#00c6fb] hover:bg-[#00a6d6] text-white rounded-full p-4 shadow-lg transition-colors">
                  <FaPlay className="text-2xl" />
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="flex-1 pt-20 lg:pt-0">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : { x: -50, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[#008db3] font-semibold tracking-widest mb-2 uppercase"
          >
            About Company
          </motion.div>
          <motion.h2
            initial={{ x: -50, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : { x: -50, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-4 text-[#0a2236]"
          >
            Your Financial Partner for Success
          </motion.h2>
          <motion.p
            initial={{ x: -50, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : { x: -50, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[#5a6a7a] text-lg mb-6"
          >
            We believe in doing the bookkeeping and accounting for your business with just in time approach. Our expertise are into redefining and counting every fraction of a cent to grow in the business and keeping your taxes up-to date and hassle free.
          </motion.p>
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            {/* Vision */}
            <div>
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={
                  isInView ? { x: 0, opacity: 1 } : { x: -50, opacity: 0 }
                }
                transition={{ duration: 0.6 }}
                className="font-bold text-xl mb-2 text-[#0a2236]"
              >
                Our Vision
              </motion.div>
              <ul className="space-y-2 text-[#008db3]">
                {[
                 
                  "🌱 Transforming Numbers into Your Business’s Growth Engine",
                  "📈 Where Accurate Books Meet Ambitious Futures",
                  "🚀 Building Financial Foundations for Tomorrow’s Success",
                  "🔍 Clarity in Your Finances, Confidence in Your Decisions",
                ].map((text, idx) => (
                  <li className="flex items-start" key={idx}>
                    {/* <FaChevronRight className="mt-1 mr-2" /> */}
                    <motion.span
                      initial={{ x: -50, opacity: 0 }}
                      animate={
                        isInView
                          ? { x: 0, opacity: 1 }
                          : { x: -50, opacity: 0 }
                      }
                      transition={{ duration: 0.6, delay: idx * 0.1 }}
                      className="text-[#5a6a7a] whitespace-nowrap"
                    >
                      {text}
                    </motion.span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mission */}
            <div>
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={
                  isInView ? { x: 0, opacity: 1 } : { x: -50, opacity: 0 }
                }
                transition={{ duration: 0.6 }}
                className="font-bold text-xl mb-2 text-[#0a2236]"
              >
                Our Mission
              </motion.div>
              <ul className="space-y-2 text-[#00c6fb]">
                {[
                  "⚖️ Where Every Transaction Matters & Every Client Counts",
                  "📈 Meticulous Books for Measurable Growth",
                  "🛠️ Fueling Small Business Dreams With Big Financial Insight",
                ].map((text, idx) => (
                  <li className="flex items-start" key={idx}>
                    {/* <FaChevronRight className="mt-1 mr-2" /> */}
                    <motion.span
                      initial={{ x: -50, opacity: 0 }}
                      animate={
                        isInView
                          ? { x: 0, opacity: 1 }
                          : { x: -50, opacity: 0 }
                      }
                      transition={{ duration: 0.6, delay: idx * 0.1 }}
                      className="text-[#5a6a7a] text-wrap whitespace-nowrap"
                    >
                      {text}
                    </motion.span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <motion.a
            initial={{ x: -50, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : { x: -50, opacity: 0 }}
            transition={{ duration: 0.6 }}
            href="#"
            className="inline-flex items-center bg-[#00c6fb] hover:bg-[#00a6d6] text-white font-semibold px-8 py-4 rounded transition-colors text-lg"
          >
            MORE ABOUT US <FaChevronRight className="ml-3" />
          </motion.a>
        </div>
      </div>

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="relative w-full max-w-2xl mx-auto p-4">
            <button
              className="absolute top-2 right-2 text-white text-3xl"
              onClick={() => setShowVideo(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="aspect-w-16 aspect-h-9 w-full">
              <iframe
                src={YOUTUBE_URL}
                title="YouTube video"
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="w-full h-96 rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </motion.section>
  );
}
