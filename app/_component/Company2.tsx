"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function Company2() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    return (
        <section className="mt-15" ref={ref}>
            {/* Our Company In Number with fixed background */}
            <div
                className="relative w-full h-[320px] flex items-center"
                style={{
                    backgroundImage: "url('/img3.jpg')",
                    backgroundAttachment: "fixed",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                }}
            >
                <div className="absolute inset-0 bg-black opacity-40"></div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between h-full"
                >
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-white text-3xl sm:text-4xl font-bold mb-6 sm:mb-0 text-center sm:text-left"
                    >
                        Our Company <br /> In Number
                    </motion.div>

                    <div className="flex flex-col sm:flex-row gap-8 text-white text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div className="text-3xl sm:text-4xl font-bold">
                                8<sup>th</sup>
                            </div>
                            <div className="font-semibold">Years Experience</div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <div className="text-3xl sm:text-4xl font-bold">300+</div>
                            <div className="font-semibold">Happy Client</div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: -50 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <div className="text-3xl sm:text-4xl font-bold">100+</div>
                            <div className="font-semibold">Project Completed</div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
