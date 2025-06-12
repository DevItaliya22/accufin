"use client";
import { FaChevronRight } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";

const latestCases = [
    { title: "Project Cost Analysis", date: "March 23, 2023", image: "/img2.jpg", link: "/cases/project-cost-analysis" },
    { title: "Inventory Management", date: "March 23, 2023", image: "/img8.jpg", link: "/cases/inventory-management" },
    { title: "Financial Accountability", date: "March 23, 2023", image: "/img8.jpg", link: "/cases/financial-accountability" },
];

const otherServices = [
    { name: "Bookkeeping" },
    { name: "Payroll Services" },
    { name: "Tax Planning" },
    { name: "Audit & Assurance" },
    { name: "Financial Statement" },
    { name: "Tech Consulting" },
    { name: "Business Advisory" },
    { name: "Outsourced CFO" }
];

export default function Restruct() {
    const router = useRouter();

    const handleNavigate = () => {
        window.scrollTo({ top: 0, behavior: "smooth" }); // allow scroll animation to complete
    };

    return (
        <section className="bg-[#f7f9fa] py-8 px-2 min-h-screen">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
                {/* Main Content */}
                <div className="flex-1 min-w-0">
                    <img
                        src="/img6.jpg"
                        alt="Financial Restructuring"
                        className="rounded-xl w-full object-cover mb-6"
                    />
                    <h1 className="text-3xl md:text-4xl font-bold text-[#0a2236] mb-4">Financial Restructuring</h1>
                    <p className="mb-4 text-[#5a6a7a]">
                        Nullam et lacinia diam. Praesent eu pulvinar orci...
                    </p>
                    <div className="mb-4 text-sm">
                        <div><span className="font-bold text-[#008db3]">Client</span>: Rometheme</div>
                        <div><span className="font-bold text-[#008db3]">Category</span>: Financial Statement</div>
                        <div><span className="font-bold text-[#008db3]">Date</span>: March 24, 2023</div>
                        <div><span className="font-bold text-[#008db3]">Location</span>: 99 Roving St., Big City, PKU 2345</div>
                    </div>

                    <h2 className="text-xl font-bold text-[#0a2236] mb-2 mt-6">Overview Project</h2>
                    <p className="mb-4 text-[#5a6a7a]">
                        In sed nisi vel tortor ornare venenatis sit amet vel felis...
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <img src="/img6.jpg" alt="Project" className="rounded-xl w-full md:w-1/2 h-48 object-cover" />
                        <img src="/img6.jpg" alt="Project" className="rounded-xl w-full md:w-1/2 h-48 object-cover" />
                    </div>
                    <p className="mb-4 text-[#5a6a7a]">
                        Nullam et lacinia diam. Praesent eu pulvinar orci...
                    </p>
                    <ul className="list-none pl-0 space-y-2 text-[#008db3]">
                        <li className="flex items-start"><FaChevronRight className="mt-1 mr-2" /><span className="text-[#5a6a7a]">Nulla congue aliquet vulputate...</span></li>
                        <li className="flex items-start"><FaChevronRight className="mt-1 mr-2" /><span className="text-[#5a6a7a]">Proin tempus auctor libero...</span></li>
                        <li className="flex items-start"><FaChevronRight className="mt-1 mr-2" /><span className="text-[#5a6a7a]">Sed venenatis purus sed...</span></li>
                        <li className="flex items-start"><FaChevronRight className="mt-1 mr-2" /><span className="text-[#5a6a7a]">Etiam lobortis sapien...</span></li>
                        <li className="flex items-start"><FaChevronRight className="mt-1 mr-2" /><span className="text-[#5a6a7a]">Etiam sit amet odio sed...</span></li>
                        <li className="flex items-start"><FaChevronRight className="mt-1 mr-2" /><span className="text-[#5a6a7a]">Integer vitae nunc eu leo...</span></li>
                    </ul>
                </div>

                {/* Sidebar */}
                <div className="w-full lg:w-[350px] flex flex-col gap-6">
                    {/* Latest Cases */}
                    <div className="bg-[#007399] rounded-xl p-6 text-white mb-2">
                        <div className="font-bold text-lg mb-4">Latest Cases</div>
                        <ul className="space-y-4">
                            {latestCases.map((c, i) => (
                                <li key={i}>
                                    <button
                                        onClick={() => handleNavigate()}
                                        className="flex items-center gap-4 rounded transition-colors p-2 -m-2 w-full text-left"
                                    >
                                        <img src={c.image} alt={c.title} className="w-16 h-12 object-cover rounded" />
                                        <div>
                                            <div className="font-semibold">{c.title}</div>
                                            <div className="text-xs">{c.date}</div>
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Us Now */}
                    <div
                        className="relative rounded-xl overflow-hidden"
                        style={{
                            backgroundImage: "url('/img6.jpg')",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                        }}
                    >
                        <div className="absolute inset-0 bg-black opacity-60"></div>
                        <div className="relative z-10 p-6 flex flex-col items-start">
                            <div className="text-white text-lg font-bold mb-2">
                                Having Trouble Managing <br /> Your Finance?
                            </div>
                            <button
                                onClick={() => handleNavigate()}
                                className="mt-2 inline-block bg-[#00c6fb] hover:translate-y-[-6px] transition-transform text-white font-semibold px-6 py-3 rounded"
                            >
                                CONTACT US NOW →
                            </button>
                        </div>
                    </div>

                    {/* Our Services */}
                    <div className="bg-[#007399] rounded-xl p-6 text-white mb-2">
                        <div className="font-bold text-lg mb-4">Other Services</div>
                        <ul className="space-y-2">
                            {otherServices.map((s) => (
                                <li key={s.name}>
                                    <button
                                        onClick={() => handleNavigate()}
                                        className="flex items-center hover:text-[#00c6fb] transition-colors text-white"
                                    >
                                        <FaChevronRight className="mr-2 text-[#00c6fb]" />
                                        {s.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Get a Free Quote */}
                    <form
                        className="bg-white border border-[#008db3] rounded-xl p-6 flex flex-col gap-4"
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <div className="font-bold text-lg mb-2 text-[#0a2236]">Get a Free Quote</div>
                        <input
                            type="text"
                            placeholder="Name"
                            required
                            className="border border-[#008db3] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00c6fb] text-[#0a2236]"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            required
                            className="border border-[#008db3] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00c6fb] text-[#0a2236]"
                        />
                        <textarea
                            placeholder="Message"
                            required
                            className="border border-[#008db3] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00c6fb] text-[#0a2236] min-h-[80px]"
                        />
                        <button
                            type="submit"
                            className="bg-[#00c6fb] hover:bg-[#009fcc] text-white font-semibold px-6 py-3 rounded transition-colors"
                        >
                            SEND MESSAGE
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}