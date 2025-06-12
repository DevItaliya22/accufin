import { FaChartBar, FaMoneyCheckAlt, FaClipboardList } from "react-icons/fa";

const projects = [
    {
        img: "/img6.jpg",
        title: "Financial Restructuring",
        desc: "Nunc volutpat, tortor sit amet sagittis ef en sed tellus diam laoreet justo, et elementum odio nibh eget ligula dolor dui tempus.",
    },
    {
        img: "/img7.jpg",
        title: "Cash Flow & Tax",
        desc: "Nunc volutpat, tortor sit amet sagittis ef en sed tellus diam laoreet justo, et elementum odio nibh eget ligula dolor dui tempus.",
    },
    {
        img: "/img8.jpg",
        title: "Inventory Management",
        desc: "Nunc volutpat, tortor sit amet sagittis ef en sed tellus diam laoreet justo, et elementum odio nibh eget ligula dolor dui tempus.",
    },
];

const stages = [
    {
        icon: <FaChartBar className="text-3xl text-[#00c6fb]" />,
        title: "Consultation",
        desc: "Elitam quis tincidunt est et efficitur ipsum nunc mixue. Bibendum ut risus et nec vehicula.",
    },
    {
        icon: <FaMoneyCheckAlt className="text-3xl text-[#00c6fb]" />,
        title: "Choose a Package",
        desc: "Elitam quis tincidunt est et efficitur ipsum nunc mixue. Bibendum ut risus et nec vehicula.",
    },
    {
        icon: <FaClipboardList className="text-3xl text-[#00c6fb]" />,
        title: "Get Your Service",
        desc: "Elitam quis tincidunt est et efficitur ipsum nunc mixue. Bibendum ut risus et nec vehicula.",
    },
];

export default function Finance() {
    return (
        <section>
          
            <div className="bg-[#f7f9fa] py-0 pb-10 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* <div className="text-center mb-2 text-[#008db3] font-semibold tracking-widest uppercase">
                        Case Studies
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-[#0a2236] text-center mb-4">
                        The Last Project We Worked On
                    </h2>
                    <p className="text-center text-[#5a6a7a] mb-10 max-w-2xl mx-auto">
                        Sed tincidunt accumsan lacus nec bibendum sapien aliquet ut suspendisse pharetra. Finibus condimentum aenean lacinia sem metus Integer.
                    </p> */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <div
                                key={project.title}
                                className="rounded-lg border border-[#008db3] bg-white hover:bg-[#008db3] hover:text-white transition-colors p-0 flex flex-col h-full group"
                            >
                                <div className="overflow-hidden rounded-t-lg">
                                    <img
                                        src={project.img}
                                        alt={project.title}
                                        className="w-full h-48 object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                                    />
                                </div>
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="font-bold text-lg mb-2">{project.title}</div>
                                    <div className="mb-4 text-sm flex-1">{project.desc}</div>
                                    <a
                                        href=""
                                        className="inline-flex items-center font-semibold text-sm group-hover:text-white text-[#00c6fb] transition-colors"
                                    >
                                        READ MORE &rarr;
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>



        </section>
    );
}