"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Loader,
  UserPlus,
  Mail,
  Lock,
  User,
  Calendar,
  CreditCard,
  Building,
} from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function CreateUserForm({
  onSuccess,
}: {
  onSuccess?: (createdUser: any) => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    sinNumber: "",
    businessNumber: "",
    dateOfBirth: "",
    contactNumber: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Email and password are required");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create user");
      }

      const createdUser = await response.json();
      toast.success("User created successfully!");
      setFormData({
        email: "",
        password: "",
        name: "",
        sinNumber: "",
        businessNumber: "",
        dateOfBirth: "",
        contactNumber: "",
      });
      onSuccess?.(createdUser);
    } catch (error: any) {
      toast.error(error.message || "An error occurred while creating the user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Required Fields Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Mail className="w-4 h-4 mr-2 text-emerald-500" />
            Required Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email Address *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="user@example.com"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password *
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter password"
                required
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Optional Fields Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <User className="w-4 h-4 mr-2 text-blue-500" />
            Personal Information (Optional)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="mt-1"
              />
            </div>

            <div>
              <Label
                htmlFor="dateOfBirth"
                className="text-sm font-medium text-gray-700"
              >
                Date of Birth
              </Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>

            <div>
              <Label
                htmlFor="contactNumber"
                className="text-sm font-medium text-gray-700"
              >
                Contact Number
              </Label>
              <Input
                id="contactNumber"
                name="contactNumber"
                type="tel"
                value={formData.contactNumber}
                onChange={handleInputChange}
                placeholder="+1 (555) 123-4567"
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Business Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Building className="w-4 h-4 mr-2 text-purple-500" />
            Business Information (Optional)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="sinNumber"
                className="text-sm font-medium text-gray-700"
              >
                SIN Number
              </Label>
              <Input
                id="sinNumber"
                name="sinNumber"
                type="text"
                value={formData.sinNumber}
                onChange={handleInputChange}
                placeholder="123-456-789"
                className="mt-1"
              />
            </div>

            <div>
              <Label
                htmlFor="businessNumber"
                className="text-sm font-medium text-gray-700"
              >
                Business Number
              </Label>
              <Input
                id="businessNumber"
                name="businessNumber"
                type="text"
                value={formData.businessNumber}
                onChange={handleInputChange}
                placeholder="123456789RT0001"
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-2 rounded-lg shadow-lg"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Creating User...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Create User
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
