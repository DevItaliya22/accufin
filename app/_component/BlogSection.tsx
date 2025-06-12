import { FaCalendarAlt, FaRegComment, FaChevronRight } from "react-icons/fa";

const blogs = [
    {
        img: "/img9.jpg",
        title: "How to Structure Your Accounting for Decision",
        date: "March 27, 2023",
        comments: 0,
        desc: "Lorem ipsum dolor sit amet elit. Maecenas eget augue nulla. Proin pellentesque interdum nisi id porttitor. Etiam ultrices accumsan augue,…",
    },
    {
        img: "/img10.jpg",
        title: "Innovation Accounting and Portfolio Management",
        date: "March 27, 2023",
        comments: 0,
        desc: "Lorem ipsum dolor sit amet elit. Maecenas eget augue nulla. Proin pellentesque interdum nisi id porttitor. Etiam ultrices accumsan augue,…",
    },
    {
        img: "/img11.jpg",
        title: "Double Entry Accounting in a Relational Database",
        date: "March 27, 2023",
        comments: 0,
        desc: "Lorem ipsum dolor sit amet elit. Maecenas eget augue nulla. Proin pellentesque interdum nisi id porttitor. Etiam ultrices accumsan augue,…",
    },
];

export default function BlogSection() {
    return (
        <section className="bg-[#f7f9fa] py-16 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-2 text-[#008db3] font-semibold tracking-widest uppercase">
                    Our Blog
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#0a2236] text-center mb-4">
                    Latest Blog & News for You
                </h2>
                <p className="text-center text-[#5a6a7a] mb-10 max-w-2xl mx-auto">
                    Sed tincidunt accumsan lacus nec bibendum sapien aliquet ut suspendisse pharetra. Finibus condimentum aenean lacinia sem metus Integer.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {blogs.map((blog) => (
                        <div
                            key={blog.title}
                            className="rounded-lg overflow-hidden border border-[#008db3] bg-white flex flex-col h-full group transition-colors duration-300 hover:bg-[#008db3] hover:text-white"
                        >
                            <div className="overflow-hidden">
                                <img
                                    src={blog.img}
                                    alt={blog.title}
                                    className="w-full h-56 object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                                />
                            </div>
                            {/* Card inner section with red background */}
                            <div className="flex-1 flex flex-col p-6 bg-[#008db3]  group-hover:bg-[#008db3] transition-colors text-white">
                                <div className="font-bold text-lg mb-2">{blog.title}</div>
                                <div className="flex items-center text-sm mb-2 opacity-80 group-hover:opacity-100">
                                    <FaCalendarAlt className="mr-2" />
                                    {blog.date}
                                    <FaRegComment className="ml-4 mr-2" />
                                    {blog.comments}
                                </div>
                                <div className="mb-4 text-sm flex-1">{blog.desc}</div>
                                <a
                                    href="#"
                                    className="inline-flex items-center font-semibold text-sm mt-auto text-white group-hover:text-white transition-colors"
                                >
                                    READ MORE <FaChevronRight className="ml-2" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
