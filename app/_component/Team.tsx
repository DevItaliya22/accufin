import Link from "next/link";

export default function Team() {
    return (
        <section
            className="relative w-full h-[320px] flex flex-col justify-center"
            style={{
                backgroundImage: "url('/img2.jpg')",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
            }}
        >
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col">
                <h1 className="text-white text-5xl font-bold mb-4 mt-10">Our Team</h1>
                <div className="flex items-center space-x-2 text-lg">
                    <Link href="/" className="text-[#00c6fb] hover:underline">Home</Link>
                    <span className="text-white">/</span>
                    <span className="text-white">Team</span>
                </div>
            </div>
        </section>
    );
}