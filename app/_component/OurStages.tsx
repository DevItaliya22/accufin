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

export default function OurStages() {
    return (
        <section>           
            {/* Our Stages */}
            <div className="bg-[#ffffff] py-16 px-4">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10">
                    {/* Stages List */}
                    <div className="flex-1 flex flex-col gap-8">
                        {stages.map((stage) => (
                            <div key={stage.title} className="flex items-start gap-4">
                                <div className="border border-[#0082a3] rounded-md  p-5 flex items-center justify-center justify-items-center">{stage.icon}</div>
                                <div>
                                    <div className="font-bold text-lg text-[#0a2236] mb-1">{stage.title}</div>
                                    <div className="text-[#5a6a7a] text-base">{stage.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Stages Text */}
                    <div className="flex-1">
                        <div className="text-[#008db3] font-semibold tracking-widest mb-2 uppercase">
                            Our Stages
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#0a2236] mb-4">
                            Easy Process to Manage Your Finances
                        </h2>
                        <p className="text-[#5a6a7a] text-base">
                            In sed nisi vel tortor ornare venenatis sit amet vel felis. Etiam sit amet odio sed nunc lacinia dictum vel quis est. Vivamus in tempor dolor. Sed eget pharetra ligula. Etiam egestas fringilla lectus, et molestie augue auctor sagittis. Nunc sit amet felis ac ex ultricies lacinia. Praesent quis ligula id tortor maximus laoreet. Fusce ultrices sed ante sollicitudin venenatis. Suspendisse potenti. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}