"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "react-hot-toast";
import { s3 } from "@/lib/s3";

type Testimonial = {
  id: string;
  name: string;
  role: string;
  text: string;
  imagePath: string | null;
  isActive: boolean;
  createdAt: string;
  imageUrl?: string | null;
};

export default function TestimonialsManagement() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [text, setText] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/admin/testimonials")
      .then((r) => (r.ok ? r.json() : Promise.reject("Failed to load")))
      .then((data: Testimonial[]) => setItems(data))
      .catch(() => toast.error("Failed to fetch testimonials"))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    if (!name || !role || !text) {
      toast.error("Please fill in name, role and text");
      return;
    }
    setCreating(true);
    try {
      let imagePath: string | null = null;
      if (imageFile) {
        const filePath = s3.getTestimonialImagePath(imageFile.name);
        const res = await fetch("/api/s3/put", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filePath, contentType: imageFile.type }),
        });
        if (!res.ok) throw new Error("Failed to get signed URL");
        const { signedUrl } = await res.json();
        const upload = await fetch(signedUrl, {
          method: "PUT",
          body: imageFile,
          headers: {
            "Content-Type": imageFile.type || "application/octet-stream",
          },
        });
        if (!upload.ok) throw new Error("Failed to upload image to S3");
        imagePath = filePath;
      }

      const createRes = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role, text, imagePath, isActive }),
      });
      if (!createRes.ok) throw new Error("Failed to create testimonial");
      const created: Testimonial = await createRes.json();
      setItems((prev) => [created, ...prev]);
      setName("");
      setRole("");
      setText("");
      setIsActive(true);
      setImageFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast.success("Testimonial created");
    } catch (e: any) {
      toast.error(e.message || "Failed to create testimonial");
    } finally {
      setCreating(false);
    }
  };

  const handleToggle = async (id: string, next: boolean) => {
    try {
      const res = await fetch("/api/admin/testimonials/toggle", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: next }),
      });
      if (!res.ok) throw new Error("Failed to toggle");
      const updated: Testimonial = await res.json();
      setItems((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, isActive: updated.isActive } : t
        )
      );
      toast.success("Updated");
    } catch (e: any) {
      toast.error(e.message || "Failed to update");
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Testimonials</h2>

      <div className="border rounded-lg p-4 mb-8 bg-white">
        <h3 className="text-lg font-medium mb-3">Add new</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
          <div className="md:col-span-2">
            <Textarea
              rows={4}
              placeholder="Text"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 md:col-span-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
            <div className="flex items-center gap-2">
              <Switch
                id="active"
                checked={isActive}
                onCheckedChange={(v) => setIsActive(v)}
              />
              <label htmlFor="active">Active</label>
            </div>
            <Button disabled={creating} onClick={handleCreate}>
              Add
            </Button>
          </div>
        </div>
      </div>

      <div className="border rounded-lg bg-white">
        <div className="grid grid-cols-12 gap-2 p-3 border-b font-medium text-sm text-gray-600">
          <div className="col-span-4">Text</div>
          <div className="col-span-2">Name</div>
          <div className="col-span-2">Role</div>
          <div className="col-span-2">Image</div>
          <div className="col-span-2">Active</div>
        </div>
        {loading ? (
          <div className="p-4">Loading...</div>
        ) : items.length === 0 ? (
          <div className="p-4">No testimonials</div>
        ) : (
          items.map((t) => (
            <div
              key={t.id}
              className="grid grid-cols-12 gap-2 p-3 border-b items-center text-sm"
            >
              <div className="col-span-4 truncate" title={t.text}>
                {t.text}
              </div>
              <div className="col-span-2">{t.name}</div>
              <div className="col-span-2">{t.role}</div>
              <div className="col-span-2">
                {t.imageUrl ? (
                  <img
                    src={t.imageUrl}
                    alt={t.name}
                    className="w-10 h-10 rounded object-cover border"
                  />
                ) : (
                  <span className="text-xs text-gray-400">Default</span>
                )}
              </div>
              <div className="col-span-2">
                <Switch
                  checked={t.isActive}
                  onCheckedChange={(v) => handleToggle(t.id, v)}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
