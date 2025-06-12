import { FaChevronRight, FaShareAlt, FaRegCalendarAlt, FaRegUser } from "react-icons/fa";

const recentBlogs = [
    { title: "How to Structure Your Accounting", date: "March 23, 2023" },
    { title: "Innovation Accounting", date: "March 19, 2023" },
    { title: "Accounting for Non-Accountant", date: "March 16, 2023" },
];

const otherServices = [
    "Bookkeeping",
    "Payroll Services",
    "Tax Planning",
    "Audit & Assurance",
    "Financial Statement",
    "Tech Consulting",
    "Business Advisory",
    "Outsourced CFO",
];

const benefits = [
    "Nulla congue aliquet vulputate feugiat.",
    "Proin tempus auctor libero tellus sit amet luctus.",
    "Sed venenatis purus sed nibh risus lacinia.",
    "Etiam sit amet odio sed nunc lacinia dictum.",
    "Integer vitae nunc eu leo tempor finibus massa sit.",
    "Cras dapibus ultricies nullam sit amet fmk.",
];

export default function Entry() {
    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <section className="bg-[#f7f9fa] py-8 px-2 min-h-screen">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
                {/* Main Content */}
                <div className="flex-1 min-w-0">
                    <img
                        src="/img6.jpg"
                        alt="Entry"
                        className="rounded-xl w-full object-cover mb-6"
                    />
                    <h1 className="text-3xl md:text-4xl font-bold text-[#0a2236] mb-2">
                        Double Entry Accounting In a Relational Database
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 mb-4 text-[#008db3] text-sm">
                        <span className="flex items-center">
                            <FaRegUser className="mr-1" /> Gaudit
                        </span>
                        <span className="flex items-center">
                            <FaRegCalendarAlt className="mr-1" /> 27 March, 2023
                        </span>
                        <a
                            href=""
                            onClick={handleScrollToTop}
                            className="flex items-center hover:text-[#00c6fb] transition-colors"
                        >
                            <FaShareAlt className="mr-1" /> Share
                        </a>
                    </div>
                    <p className="mb-4 text-[#5a6a7a]">
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Blanditiis odio molestias illo repellendus necessitatibus quod perspiciatis illum quos exercitationem pariatur quis repellat ullam placeat tempora facere reprehenderit praesentium vero corporis, accusamus consectetur? Ullam accusantium cum facere, necessitatibus tenetur dicta exercitationem deserunt asperiores. Ipsa neque quia sequi excepturi! Adipisci possimus autem commodi corrupti optio suscipit exercitationem, quaerat tenetur ducimus non cupiditate accusantium quas praesentium doloribus! Numquam omnis excepturi deleniti neque cumque optio consectetur enim inventore, dolores maxime nam rerum facere quo tempore! Explicabo accusantium recusandae velit laborum suscipit harum ipsa nam laudantium delectus ea? Quisquam veritatis fuga obcaecati sit. Doloribus, harum nulla? Veritatis facilis delectus tempora molestias saepe debitis nam facere numquam reiciendis quibusdam corrupti quasi in laboriosam explicabo temporibus, possimus, fugit repellat consectetur! Unde reiciendis incidunt ducimus quam at eveniet, cumque deleniti veniam assumenda aliquid! Soluta nesciunt, provident quaerat vel sit at officiis ut dolores corrupti voluptates magni, est ab.
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <img
                            src="/img6.jpg"
                            alt="Entry"
                            className="rounded-xl w-full md:w-1/2 h-48 object-cover"
                        />
                        <ul className="list-none pl-0 space-y-2 text-[#008db3] flex-1">
                            {benefits.map((b, i) => (
                                <li key={i} className="flex items-start">
                                    <FaChevronRight className="mt-1 mr-2" />
                                    <span className="text-[#5a6a7a]">{b}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <p className="mb-4 text-[#5a6a7a]">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolorem commodi perferendis, eligendi quos reprehenderit maxime nam sint corporis totam saepe atque veritatis! Doloremque, voluptatum beatae! Dolor, labore! Maiores corrupti quisquam sit excepturi quibusdam est fugit accusamus illo amet aliquid, deleniti perferendis iure velit. Voluptate eos fugit odit voluptatum assumenda hic.</p>
                    <p className="mb-4 text-[#5a6a7a]">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolorem commodi perferendis, eligendi quos reprehenderit maxime nam sint corporis totam saepe atque veritatis! Doloremque, voluptatum beatae! Dolor, labore! Maiores corrupti quisquam sit excepturi quibusdam est fugit accusamus illo amet aliquid, deleniti perferendis iure velit. Voluptate eos fugit odit voluptatum assumenda hic.</p>
                    <p className="mb-4 text-[#5a6a7a]">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolorem commodi perferendis, eligendi quos reprehenderit maxime nam sint corporis totam saepe atque veritatis! Doloremque, voluptatum beatae! Dolor, labore! Maiores corrupti quisquam sit excepturi quibusdam est fugit accusamus illo amet aliquid, deleniti perferendis iure velit. Voluptate eos fugit odit voluptatum assumenda hic.</p>
                </div>

                {/* Sidebar */}
                <div className="w-full lg:w-[350px] flex flex-col gap-6">
                    {/* Recent Blog */}
                    <div className="bg-[#007399] rounded-xl p-6 text-white mb-2">
                        <div className="font-bold text-lg mb-4">Recent Blog</div>
                        <ul className="space-y-4">
                            {recentBlogs.map((b, i) => (
                                <li key={i}>
                                    <a
                                        href=""
                                        onClick={handleScrollToTop}
                                        className="flex items-center gap-4 bg-[#00c6fb] rounded transition-colors p-2 -m-2"
                                    >
                                        <img
                                            src="/img6.jpg"
                                            alt={b.title}
                                            className="w-16 h-12 object-cover rounded"
                                        />
                                        <div>
                                            <div className="font-semibold">{b.title}</div>
                                            <div className="text-xs">{b.date}</div>
                                        </div>
                                    </a>
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
                            <a
                                href=""
                                onClick={handleScrollToTop}
                                className="mt-2 inline-block bg-[#00c6fb] hover:translate-y-[-6px] transition-transform text-white font-semibold px-6 py-3 rounded"
                            >
                                CONTACT US NOW &rarr;
                            </a>
                        </div>
                    </div>

                    {/* Our Services */}
                    <div className="bg-[#007399] rounded-xl p-6 text-white mb-2">
                        <div className="font-bold text-lg mb-4">Our Services</div>
                        <ul className="space-y-2">
                            {otherServices.map((service) => (
                                <li key={service}>
                                    <a
                                        href=""
                                        onClick={handleScrollToTop}
                                        className="flex items-center hover:text-[#00c6fb] transition-colors"
                                    >
                                        <FaChevronRight className="mr-2 text-[#00c6fb]" />
                                        {service}
                                    </a>
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