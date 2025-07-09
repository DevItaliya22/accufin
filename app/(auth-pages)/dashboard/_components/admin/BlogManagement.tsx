"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import {
  FileText,
  Plus,
  Pencil,
  ToggleLeft,
  ToggleRight,
  X,
  Info,
  Calendar,
  Tag,
  Eye,
  EyeOff,
} from "lucide-react";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { formatTextWithLinks } from "@/lib/utils";

interface Blog {
  id: string;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  tags: string[];
}

export default function BlogManagement() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState("");

  // Fetch blogs on component mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch("/api/admin/blogs");
      if (!response.ok) throw new Error("Failed to fetch blogs");
      const data = await response.json();
      setBlogs(data);
    } catch (err) {
      setError("Failed to load blogs");
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleAddBlog = async () => {
    try {
      const response = await fetch("/api/admin/blogs/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to add blog");
      toast.success("Blog added successfully");
      setIsAddModalOpen(false);
      setFormData({ title: "", content: "", tags: [] });
      fetchBlogs();
    } catch (err) {
      toast.error("Failed to add blog");
    }
  };

  const handleEditBlog = async () => {
    if (!selectedBlog) return;
    try {
      const response = await fetch("/api/admin/blogs/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedBlog.id,
          ...formData,
        }),
      });
      if (!response.ok) throw new Error("Failed to update blog");
      toast.success("Blog updated successfully");
      setIsEditModalOpen(false);
      setSelectedBlog(null);
      setFormData({ title: "", content: "", tags: [] });
      fetchBlogs();
    } catch (err) {
      toast.error("Failed to update blog");
    }
  };

  const handleToggleStatus = async (blogId: string, currentStatus: boolean) => {
    try {
      const response = await fetch("/api/admin/blogs/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: blogId,
          isActive: !currentStatus,
        }),
      });
      if (!response.ok) throw new Error("Failed to update blog status");
      toast.success("Blog status updated successfully");
      fetchBlogs();
    } catch (err) {
      toast.error("Failed to update blog status");
    }
  };

  const openEditModal = (blog: Blog) => {
    setSelectedBlog(blog);
    setFormData({
      title: blog.title,
      content: blog.content,
      tags: blog.tags || [],
    });
    setIsEditModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          Blog Management
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Create, edit, and manage your blog posts with tags and content
          formatting
        </p>
      </div>

      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-orange-50">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-orange-100 via-orange-200 to-red-200 border-b border-orange-300 p-6">
          <div className="flex items-center space-x-4">
            <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-sm"></div>
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold text-gray-800">
                Blog Posts
              </CardTitle>
              <CardDescription className="text-gray-700 font-medium">
                Manage your blog content and publications
              </CardDescription>
            </div>
          </div>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <Plus className="w-4 h-4 mr-2" />
                Add Blog
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl bg-gradient-to-br from-white to-orange-50">
              <DialogHeader className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg -m-4 mb-4">
                <DialogTitle className="text-xl text-gray-800 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-orange-600" />
                  Add New Blog Post
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Blog Title
                  </label>
                  <Input
                    placeholder="Enter blog title..."
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Blog Content
                  </label>
                  <div className="relative">
                    <Textarea
                      placeholder="Write your blog content here..."
                      value={formData.content}
                      onChange={(e) =>
                        setFormData({ ...formData, content: e.target.value })
                      }
                      className="min-h-[300px] border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                    />
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white border border-gray-200"
                        >
                          <Info className="w-4 h-4 text-orange-600" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-800 flex items-center">
                            <Info className="w-4 h-4 mr-2 text-orange-600" />
                            Link Format Guide
                          </h4>
                          <p className="text-sm text-gray-600">
                            To add links in your content, use this format:
                          </p>
                          <div className="bg-white p-3 rounded-lg border border-orange-200 text-sm font-mono text-orange-700">
                            {`[[Link Text]]{{https://example.com}}`}
                          </div>
                          <p className="text-sm text-gray-600">
                            Example:{" "}
                            <span className="text-orange-600 font-medium">
                              {`[[Click here]]{{http://localhost:3000/dashboard}}`}
                            </span>
                          </p>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <Tag className="w-4 h-4 mr-2 text-orange-600" />
                    Tags
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                    />
                    <Button
                      type="button"
                      onClick={handleAddTag}
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0"
                    >
                      Add Tag
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge
                        key={tag}
                        className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border border-orange-200 hover:from-orange-200 hover:to-red-200 flex items-center gap-1"
                      >
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-red-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleAddBlog}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 shadow-md"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Blog Post
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader size={48} className="mb-4 text-orange-500" />
              <p className="text-gray-500">Loading blogs...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-100 to-orange-100 rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-red-500 text-lg">{error}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {blogs.length > 0 ? (
                blogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="bg-white rounded-lg border border-orange-200 p-6 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          {blog.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1 text-orange-500" />
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Tag className="w-4 h-4 mr-1 text-orange-500" />
                            {blog.tags?.length || 0} tags
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleToggleStatus(blog.id, blog.isActive)
                          }
                          className={`${
                            blog.isActive
                              ? "text-green-600 hover:bg-green-50"
                              : "text-gray-400 hover:bg-gray-50"
                          }`}
                        >
                          {blog.isActive ? (
                            <Eye className="w-4 h-4 mr-1" />
                          ) : (
                            <EyeOff className="w-4 h-4 mr-1" />
                          )}
                          <span className="text-xs">
                            {blog.isActive ? "Active" : "Inactive"}
                          </span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(blog)}
                          className="text-orange-600 hover:bg-orange-50"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {blog.content.substring(0, 200)}...
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {blog.tags?.map((tag) => (
                        <Badge
                          key={tag}
                          className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border border-orange-200"
                        >
                          {formatTextWithLinks(tag, "orange-500")}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-100 to-red-100 rounded-full flex items-center justify-center">
                    <FileText className="w-8 h-8 text-orange-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Blogs Found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Start creating your first blog post to engage with your
                    audience
                  </p>
                  <Button
                    className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white border-0 shadow-md"
                    onClick={() => setIsAddModalOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Blog
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl bg-gradient-to-br from-white to-orange-50">
          <DialogHeader className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg -m-4 mb-4">
            <DialogTitle className="text-xl text-gray-800 flex items-center">
              <Pencil className="w-5 h-5 mr-2 text-orange-600" />
              Edit Blog Post
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Blog Title
              </label>
              <Input
                placeholder="Enter blog title..."
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Blog Content
              </label>
              <Textarea
                placeholder="Write your blog content here..."
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                className="min-h-[300px] border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Tag className="w-4 h-4 mr-2 text-orange-600" />
                Tags
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
                <Button
                  type="button"
                  onClick={handleAddTag}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0"
                >
                  Add Tag
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge
                    key={tag}
                    className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border border-orange-200 hover:from-orange-200 hover:to-red-200 flex items-center gap-1"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <Button
              onClick={handleEditBlog}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 shadow-md"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Update Blog Post
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
