"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function Contact() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    return (
        <section className="bg-[#f7f9fa] pt-12 pb-0 px-2" ref={ref}>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12"
            >
                {/* Form */}
                <form
                    className="flex-1 flex flex-col gap-4"
                    onSubmit={e => e.preventDefault()}
                >
                    <div className="font-bold text-xl mb-2">Send Us a Message</div>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 flex flex-col">
                            <input
                                type="text"
                                placeholder="Name"
                                required
                                className="border border-[#008db3] rounded px-3 py-2 mb-1 focus:outline-none focus:ring-2 focus:ring-[#00c6fb] text-[#0a2236]"
                            />
                        </div>
                        <div className="flex-1 flex flex-col">
                            <input
                                type="email"
                                placeholder="Email"
                                required
                                className="border border-[#008db3] rounded px-3 py-2 mb-1 focus:outline-none focus:ring-2 focus:ring-[#00c6fb] text-[#0a2236]"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <input
                            type="text"
                            placeholder="Subject"
                            required
                            className="border border-[#008db3] rounded px-3 py-2 mb-1 focus:outline-none focus:ring-2 focus:ring-[#00c6fb] text-[#0a2236]"
                        />
                    </div>
                    <div className="flex flex-col">
                        <textarea
                            placeholder="Message"
                            required
                            className="border border-[#008db3] rounded px-3 py-2 mb-1 focus:outline-none focus:ring-2 focus:ring-[#00c6fb] text-[#0a2236] min-h-[80px]"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-[#007399] hover:bg-[#005f7a] text-white font-semibold px-6 py-3 rounded transition-colors w-full md:w-auto"
                    >
                        SEND MESSAGE
                    </button>
                </form>

                {/* Contact Info */}
                <div className="flex-1 flex flex-col gap-4">
                    <div className="text-[#008db3] font-semibold tracking-widest mb-2 uppercase">
                        Contact Us
                    </div>
                    <div className="text-3xl font-bold text-[#0a2236] mb-2">Get In Touch!</div>
                    <p className="text-[#5a6a7a] mb-4">
                        Proin laoreet nisi vitae pharetra mattis, etiam luctus suscipit. Augue molestie a etiam quis tincidunt est, et efficitur ipsum nunc bibendum ut risus et vehicula proin tempus.
                    </p>
                    <div className="flex items-start mb-4">
                        <FaPhoneAlt className="text-2xl mr-3 mt-1 text-[#00c6fb]" />
                        <div>
                            <div className="font-bold">Call Us</div>
                            <div>+123-234-1234</div>
                        </div>
                    </div>
                    <div className="flex items-start mb-4">
                        <FaEnvelope className="text-2xl mr-3 mt-1 text-[#00c6fb]" />
                        <div>
                            <div className="font-bold">Email Us</div>
                            <div>hello@awesomesite.com</div>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <FaMapMarkerAlt className="text-2xl mr-3 mt-1 text-[#00c6fb]" />
                        <div>
                            <div className="font-bold">Office Address</div>
                            <div>99 Roving St., Big City, PKU 23456</div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Map */}
            <div className="w-full mt-12">
                <iframe
                    title="Google Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2436.684964073624!2d-0.1277586842290132!3d51.50735077963509!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761b3333333333%3A0x1234567890abcdef!2sLondon!5e0!3m2!1sen!2suk!4v1680000000000!5m2!1sen!2suk"
                    width="100%"
                    height="350"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-none grayscale w-full"
                ></iframe>
            </div>
        </section>
    );
}
