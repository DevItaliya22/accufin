"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader } from "@/components/ui/loader";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Shield,
  ArrowLeft,
  Send,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";

interface FormField {
  id: string;
  type: "input" | "selection" | "multipleChoice";
  label: string;
  required: boolean;
  inputType?: string;
  options?: string[];
  maxChoices?: number;
}

interface FormData {
  id: string;
  title: string;
  description: string | null;
  isCompulsory: boolean;
  privacyLabel: string;
  fields: FormField[];
}

interface FormAnswer {
  fieldId: string;
  fieldType: string;
  value: string;
}

export default function FormFillPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form answers state
  const [answers, setAnswers] = useState<{ [fieldId: string]: string }>({});
  const [multipleChoiceAnswers, setMultipleChoiceAnswers] = useState<{
    [fieldId: string]: string[];
  }>({});
  const [privacyConsent, setPrivacyConsent] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    if (session.user?.isAdmin) {
      router.push("/dashboard");
      return;
    }

    fetchFormData();
  }, [session, status, router, params.id]);

  const fetchFormData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/user/forms/${params.id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Form not found");
        }
        throw new Error("Failed to fetch form");
      }
      const data = await response.json();
      setFormData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load form");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (fieldId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleMultipleChoiceChange = (
    fieldId: string,
    option: string,
    checked: boolean
  ) => {
    setMultipleChoiceAnswers((prev) => {
      const current = prev[fieldId] || [];
      const field = formData?.fields.find((f) => f.id === fieldId);
      const maxChoices = field?.maxChoices || 1;

      if (checked) {
        if (current.length < maxChoices) {
          return {
            ...prev,
            [fieldId]: [...current, option],
          };
        } else {
          toast.error(`You can select maximum ${maxChoices} options`);
          return prev;
        }
      } else {
        return {
          ...prev,
          [fieldId]: current.filter((item) => item !== option),
        };
      }
    });
  };

  const validateForm = (): boolean => {
    if (!formData) return false;

    // Check privacy consent
    if (!privacyConsent) {
      toast.error("You must agree to the privacy policy to submit the form");
      return false;
    }

    // Check required fields
    for (const field of formData.fields) {
      if (field.required) {
        if (field.type === "multipleChoice") {
          const selected = multipleChoiceAnswers[field.id];
          if (!selected || selected.length === 0) {
            toast.error(`Please answer the required field: ${field.label}`);
            return false;
          }
        } else {
          const answer = answers[field.id];
          if (!answer || answer.trim() === "") {
            toast.error(`Please answer the required field: ${field.label}`);
            return false;
          }
        }
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);

      // Prepare form answers
      const formAnswers: FormAnswer[] = [];

      // Add regular field answers
      Object.entries(answers).forEach(([fieldId, value]) => {
        if (value.trim()) {
          const field = formData?.fields.find((f) => f.id === fieldId);
          if (field) {
            formAnswers.push({
              fieldId,
              fieldType: field.type,
              value: value.trim(),
            });
          }
        }
      });

      // Add multiple choice answers
      Object.entries(multipleChoiceAnswers).forEach(([fieldId, values]) => {
        if (values.length > 0) {
          formAnswers.push({
            fieldId,
            fieldType: "multipleChoice",
            value: values.join(", "),
          });
        }
      });

      const response = await fetch(`/api/user/forms/${params.id}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers: formAnswers,
          isChecked: privacyConsent,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      toast.success("Form submitted successfully!");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit form");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader size={48} className="mb-4 text-blue-500" />
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8">Page not found</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  onClick={() => router.push("/dashboard")}
                  className="mr-4"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
                <h1 className="text-xl font-semibold text-gray-900">
                  Fill Form
                </h1>
              </div>
            </div>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="text-center py-8 text-red-500">
              {error}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => router.push("/dashboard")}
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">Fill Form</h1>
            </div>
            <div className="flex items-center space-x-2">
              {formData?.isCompulsory && (
                <Badge
                  variant="destructive"
                  className="flex items-center space-x-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  <span>Required</span>
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <span>{formData?.title}</span>
              {formData?.isCompulsory && (
                <Badge variant="destructive" className="text-xs">
                  Required
                </Badge>
              )}
            </CardTitle>
            {formData?.description && (
              <CardDescription>{formData.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Form Fields */}
              {formData?.fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    {field.label}
                    {field.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </Label>

                  {/* Input Field */}
                  {field.type === "input" && (
                    <Input
                      type={field.inputType || "text"}
                      value={answers[field.id] || ""}
                      onChange={(e) =>
                        handleInputChange(field.id, e.target.value)
                      }
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      required={field.required}
                    />
                  )}

                  {/* Radio Button (Selection) */}
                  {field.type === "selection" && field.options && (
                    <RadioGroup
                      value={answers[field.id] || ""}
                      onValueChange={(value) =>
                        handleInputChange(field.id, value)
                      }
                      className="space-y-2"
                    >
                      {field.options.map((option, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            value={option}
                            id={`${field.id}-${index}`}
                          />
                          <Label
                            htmlFor={`${field.id}-${index}`}
                            className="text-sm"
                          >
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}

                  {/* Multiple Choice (Checkbox) */}
                  {field.type === "multipleChoice" && field.options && (
                    <div className="space-y-2">
                      {field.options.map((option, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`${field.id}-${index}`}
                            checked={(
                              multipleChoiceAnswers[field.id] || []
                            ).includes(option)}
                            onCheckedChange={(checked) =>
                              handleMultipleChoiceChange(
                                field.id,
                                option,
                                checked as boolean
                              )
                            }
                          />
                          <Label
                            htmlFor={`${field.id}-${index}`}
                            className="text-sm"
                          >
                            {option}
                          </Label>
                        </div>
                      ))}
                      <p className="text-xs text-gray-500">
                        Maximum {field.maxChoices} choice(s) allowed
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {/* Privacy Consent */}
              <div className="border-t pt-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="privacy-consent"
                      checked={privacyConsent}
                      onCheckedChange={(checked) =>
                        setPrivacyConsent(checked as boolean)
                      }
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor="privacy-consent"
                        className="text-sm font-medium text-gray-900 cursor-pointer"
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <Shield className="w-4 h-4 text-yellow-600" />
                          <span>Privacy Consent</span>
                          <span className="text-red-500">*</span>
                        </div>
                      </Label>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {formData?.privacyLabel}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className={`flex items-center space-x-2 ${
                    formData?.isCompulsory
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? "Submitting..." : "Submit Form"}</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
