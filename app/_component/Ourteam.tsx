
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const team = [
    {
        img: "/img12.jpg",
        name: "Bill Sebastian",
        role: "Gaudit Founder",
    },
    {
        img: "/img13.jpg",
        name: "Chris Hammer",
        role: "Gaudit Co-Founder",
    },
    {
        img: "/img14.jpg",
        name: "Monica James",
        role: "Senior Accountant",
    },
    {
        img: "/img15.jpg",
        name: "Michael Keanu",
        role: "Budget Analyst",
    },
];

export default function Ourteam() {
    return (
        <section className="bg-[#f7f9fa] py-16 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-2 text-[#008db3] font-semibold tracking-widest uppercase">
                    Our Team
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#0a2236] text-center mb-4">
                    Our Experienced Accountants
                </h2>
                <p className="text-center text-[#5a6a7a] mb-10 max-w-2xl mx-auto">
                    Sed tincidunt accumsan lacus nec bibendum sapien aliquet ut suspendisse pharetra. Finibus condimentum aenean lacinia sem metus Integer.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {team.map((member, idx) => (
                        <div key={member.name} className="flex flex-col items-center">
                            {/* Card with hover effect */}
                            <div className="relative w-full rounded-xl overflow-hidden group shadow-md">
                                <img
                                    src={member.img}
                                    alt={member.name}
                                    className="w-full h-[340px] object-cover"
                                />
                                {/* Overlay with social icons */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#008db3] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center">
                                    <div className="flex space-x-4 mb-6">
                                        {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, i) => (
                                            <a
                                                key={i}
                                                href=""
                                                className="bg-[#00c6fb] rounded-full p-3 flex items-center justify-center transition-transform duration-300 hover:animate-bounceY"
                                                style={{ transitionDelay: `${i * 50}ms` }}
                                            >
                                                <Icon className="text-xl text-white" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {/* Name and Role */}
                            <div className="w-full bg-[#007399] text-white text-center rounded-b-xl py-3 mt-2">
                                <div className="font-bold text-2xl mb-1">{member.name}</div>
                                <div className="text-base">{member.role}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Custom bounce animation for icon */}
            <style jsx>{`
        @keyframes bounceY {
          0% { transform: translateY(0);}
          20% { transform: translateY(-10px);}
          40% { transform: translateY(8px);}
          60% { transform: translateY(-4px);}
          80% { transform: translateY(2px);}
          100% { transform: translateY(0);}
        }
        .hover\\:animate-bounceY:hover {
          animation: bounceY 0.6s;
        }
      `}</style>
        </section>
    );
}
