"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  FormInput,
  Edit,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  FileText,
  AlertCircle,
  Calendar,
  BarChart3,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/ui/loader";
import toast from "react-hot-toast";

interface Form {
  id: string;
  title: string;
  description: string | null;
  isActive: boolean;
  isCompulsory: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    inputs: number;
    selections: number;
    multipleChoice: number;
    formResponses: number;
  };
}

export default function FormsManagement() {
  const router = useRouter();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [togglingCompulsoryId, setTogglingCompulsoryId] = useState<
    string | null
  >(null);

  // Fetch forms
  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/forms");
      if (!response.ok) {
        throw new Error("Failed to fetch forms");
      }
      const data = await response.json();
      setForms(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load forms");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (formId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this form? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setDeletingId(formId);
      const response = await fetch(`/api/admin/forms?id=${formId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete form");
      }

      toast.success("Form deleted successfully!");
      await fetchForms(); // Refresh forms list
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete form");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleActive = async (formId: string, currentStatus: boolean) => {
    try {
      setTogglingId(formId);
      const response = await fetch("/api/admin/forms/toggle", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: formId,
          isActive: !currentStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to toggle form status");
      }

      toast.success(
        `Form ${!currentStatus ? "activated" : "deactivated"} successfully!`
      );
      await fetchForms(); // Refresh forms list
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to toggle form status"
      );
    } finally {
      setTogglingId(null);
    }
  };

  const handleToggleCompulsory = async (
    formId: string,
    currentStatus: boolean
  ) => {
    try {
      setTogglingCompulsoryId(formId);
      const response = await fetch("/api/admin/forms/toggle-compulsory", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: formId,
          isCompulsory: !currentStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to toggle form compulsory status");
      }

      toast.success(
        `Form marked as ${
          !currentStatus ? "compulsory" : "optional"
        } successfully!`
      );
      await fetchForms(); // Refresh forms list
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to toggle compulsory status"
      );
    } finally {
      setTogglingCompulsoryId(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Loader size={48} className="mb-2 text-blue-500" />
          <span className="text-gray-500">Loading forms...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-8 text-red-500">
          {error}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Form Management</CardTitle>
              <CardDescription>
                Create and manage forms for data collection
              </CardDescription>
            </div>
            <Button
              onClick={() => router.push("/dashboard/form/add")}
              className="flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Form</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {forms.length === 0 ? (
            <div className="text-center py-12">
              <FormInput className="w-16 h-16 mx-auto mb-4 text-gray-300 opacity-20" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Forms Yet
              </h3>
              <p className="text-gray-500 mb-4">
                Get started by creating your first form
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {forms.map((form) => (
                <Card
                  key={form.id}
                  className="hover:shadow-lg transition-shadow duration-200"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge
                            variant={form.isActive ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {form.isActive ? "Active" : "Inactive"}
                          </Badge>
                          {form.isCompulsory && (
                            <Badge variant="destructive" className="text-xs">
                              Required
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl leading-tight">
                          {form.title}
                        </CardTitle>
                        {form.description && (
                          <CardDescription className="mt-2 text-base">
                            {form.description}
                          </CardDescription>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                      <div className="flex flex-wrap gap-6 text-sm">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <FormInput className="w-4 h-4" />
                          <span>
                            {form._count.inputs +
                              form._count.selections +
                              form._count.multipleChoice}{" "}
                            fields
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <BarChart3 className="w-4 h-4" />
                          <span>{form._count.formResponses} responses</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span>
                            Created{" "}
                            {new Date(form.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(`/dashboard/form/edit/${form.id}`)
                          }
                          className="flex items-center space-x-1"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(`/dashboard/form/responses/${form.id}`)
                          }
                          className="flex items-center space-x-1"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Responses</span>
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleToggleActive(form.id, form.isActive)
                          }
                          disabled={togglingId === form.id}
                          className="flex items-center space-x-1"
                        >
                          {form.isActive ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                          <span>
                            {form.isActive ? "Deactivate" : "Activate"}
                          </span>
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleToggleCompulsory(form.id, form.isCompulsory)
                          }
                          disabled={togglingCompulsoryId === form.id}
                          className="flex items-center space-x-1"
                        >
                          <AlertCircle className="w-4 h-4" />
                          <span>
                            {form.isCompulsory ? "Optional" : "Required"}
                          </span>
                        </Button>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(form.id)}
                          disabled={deletingId === form.id}
                          className="flex items-center space-x-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
