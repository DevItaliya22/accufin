"use client";

export default function Company2() {
    return (
        <section className="mt-15">
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
                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between h-full">
                    <div className="text-white text-3xl sm:text-4xl font-bold mb-6 sm:mb-0">
                        Our Company <br /> In Number
                    </div>
                    <div className="flex flex-col sm:flex-row gap-8 text-white text-center">
                        <div>
                            <div className="text-3xl sm:text-4xl font-bold">
                                15<sup>th</sup>
                            </div>
                            <div className="font-semibold">Years Experience</div>
                        </div>
                        <div>
                            <div className="text-3xl sm:text-4xl font-bold">1,700+</div>
                            <div className="font-semibold">Happy Client</div>
                        </div>
                        <div>
                            <div className="text-3xl sm:text-4xl font-bold">4,300+</div>
                            <div className="font-semibold">Project Completed</div>
                        </div>
                    </div>
                </div>
            </div>


        </section>
    );
}