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
import { ArrowLeft, CheckCircle, Shield, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FormAnswer {
  id: string;
  fieldId: string;
  fieldType: string;
  value: string;
  createdAt: string;
  fieldLabel: string;
}

interface FormSubmission {
  id: string;
  formTitle: string;
  formDescription: string | null;
  isCompulsory: boolean;
  isChecked: boolean;
  submittedAt: string;
  answers: FormAnswer[];
}

export default function ViewFormSubmissionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [submission, setSubmission] = useState<FormSubmission | null>(null);
  const [error, setError] = useState<string | null>(null);

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

    fetchSubmission();
  }, [session, status, router, params.id]);

  const fetchSubmission = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/user/forms/${params.id}/submission`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Form submission not found");
        }
        throw new Error("Failed to fetch submission");
      }
      const data = await response.json();
      setSubmission(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load submission"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader size={48} className="mb-4 text-blue-500" />
          <p className="text-gray-600">Loading submission...</p>
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
                  View Submission
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
              <h1 className="text-xl font-semibold text-gray-900">
                View Submission
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <Badge
                variant="secondary"
                className="flex items-center space-x-1"
              >
                <CheckCircle className="w-3 h-3" />
                <span>Submitted</span>
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <span>{submission?.formTitle}</span>
              {submission?.isCompulsory && (
                <Badge variant="destructive" className="text-xs">
                  Required
                </Badge>
              )}
            </CardTitle>
            {submission?.formDescription && (
              <CardDescription>{submission.formDescription}</CardDescription>
            )}
            <div className="text-sm text-gray-500">
              Submitted on{" "}
              {submission
                ? new Date(submission.submittedAt).toLocaleDateString()
                : ""}{" "}
              at{" "}
              {submission
                ? new Date(submission.submittedAt).toLocaleTimeString()
                : ""}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Form Answers */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Your Responses
              </h3>
              {submission?.answers && submission.answers.length > 0 ? (
                submission.answers.map((answer) => (
                  <div
                    key={answer.id}
                    className="border rounded-lg p-4 bg-gray-50"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700">
                          {answer.fieldLabel}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {answer.fieldType}
                        </Badge>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <p className="text-gray-900">{answer.value}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No responses found
                </div>
              )}
            </div>

            {/* Privacy Consent Status */}
            <div className="border-t pt-6">
              <div
                className={`border rounded-lg p-4 ${
                  submission?.isChecked
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-center space-x-3">
                  {submission?.isChecked ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                  <div>
                    <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                      <Shield className="w-4 h-4" />
                      <span>Privacy Consent</span>
                    </h4>
                    <p
                      className={`text-sm ${
                        submission?.isChecked
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {submission?.isChecked
                        ? "You have granted consent for data processing"
                        : "Consent was not granted"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
