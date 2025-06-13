import React from "react";
import { formatTextWithLinks } from "@/lib/utils";

const Read: React.FC<{ title: string; content: string; tags: string[] }> = ({
  title,
  content,
  tags,
}) => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">
        {title}
      </h1>
      <div className="space-y-4 text-justify text-base md:text-lg text-gray-800">
        {formatTextWithLinks(content,"blue-500")}
      </div>
      <div className="mt-8 flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <a
            key={index}
            href={`/blog?tag=${tag}`}
            className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
          >
            {formatTextWithLinks(tag,"blue-500")}
          </a>
        ))}
      </div>
    </div>
  );
};

export default Read;
