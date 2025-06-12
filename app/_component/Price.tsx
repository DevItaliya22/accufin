"use client";
import { FaArrowRight } from "react-icons/fa";

const plans = [
    {
        name: "Standard",
        price: 49,
        features: [
            "Nulla congue aliquet vulputate",
            "Proin tempus auctor libero",
            "Sed venenatis purus sed",
            "Etiam lobortis sapien amatuq",
            "Congue id erat non tempus",
        ],
        highlight: false,
    },
    {
        name: "Enterprise",
        price: 129,
        features: [
            "Nulla congue aliquet vulputate",
            "Proin tempus auctor libero",
            "Sed venenatis purus sed",
            "Etiam lobortis sapien amatuq",
            "Congue id erat non tempus",
        ],
        highlight: true,
    },
    {
        name: "Proffesional",
        price: 89,
        features: [
            "Nulla congue aliquet vulputate",
            "Proin tempus auctor libero",
            "Sed venenatis purus sed",
            "Etiam lobortis sapien amatuq",
            "Congue id erat non tempus",
        ],
        highlight: false,
    },
];

export default function Price() {
    return (
        <section className="bg-[#f7f7f7] py-16 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-10 gap-6">
                    <div className="flex-1">
                        <div className="uppercase text-xs tracking-widest text-[#008db3] mb-1">Pricing Plan</div>
                        <h2 className="text-3xl md:text-5xl font-bold text-[#0a2236] mb-4">The Best Price For You</h2>
                    </div>
                    <div className="flex-1 flex items-center">
                        <p className="text-[#5a6a7a] text-sm md:text-base max-w-xl">
                            Proin laoreet nisi vitae pharetra mattis. Etiam luctus suscipit velit vitae mixue ultricies. Augue molestie a etiam quis tincidunt est, et efficitur ipsum nunc bibendum ut risus et vehicula proin tempus tellus diam laoreet justo donec tempus.
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`flex flex-col border rounded-xl p-8 transition shadow-sm ${plan.highlight
                                    ? "bg-[#0082a3] text-white shadow-lg"
                                    : "bg-white text-[#0a2236] border-[#0082a3]"
                                }`}
                        >
                            <div className="font-bold text-2xl mb-2">{plan.name}</div>
                            <div className="flex items-end mb-2">
                                <span className="text-5xl font-bold mr-2">${plan.price}</span>
                                <span className="text-lg font-semibold">/ Month</span>
                            </div>
                            <p className={`mb-6 ${plan.highlight ? "text-white/80" : "text-[#5a6a7a]"}`}>
                                Nam ultrices lacus interdum neque sagittis. Integer porta sem eu facilisis.
                            </p>
                            <ul className="mb-8 space-y-2">
                                {plan.features.map((feature, i) => (
                                    <li
                                        key={i}
                                        className={`flex items-center border-b last:border-b-0 pb-2 last:pb-0 ${plan.highlight ? "border-white/30" : "border-[#0082a3]/30"
                                            }`}
                                    >
                                        <span className="mr-2 text-[#00b6d6] text-lg font-bold">›</span>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <a
                                href="#"
                                className="mt-auto inline-flex items-center justify-center px-8 py-3 rounded bg-[#00b6d6] text-white font-semibold tracking-wide transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
                            >
                                Get Started <FaArrowRight className="ml-2" />
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
