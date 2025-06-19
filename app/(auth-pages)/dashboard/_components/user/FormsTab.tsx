import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { FormInput, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import React from "react";

type FormWithStatus = {
  id: string;
  title: string;
  description: string | null;
  isActive: boolean;
  isCompulsory: boolean;
  createdAt: string;
  isCompleted: boolean;
  completedAt: string | null;
};

type FormsTabProps = {
  forms: FormWithStatus[];
  isLoading: boolean;
  router: any;
};

export default function FormsTab({ forms, isLoading, router }: FormsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Forms</CardTitle>
        <CardDescription>
          Complete required forms and view optional ones
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">
              Loading forms...
            </div>
          ) : forms.length > 0 ? (
            forms.map((form) => {
              // Determine background color based on status
              let bgColor = "bg-white";
              let borderColor = "border-gray-200";
              let statusIcon = <Clock className="w-5 h-5 text-gray-500" />;
              let statusText = "Pending";
              let statusTextColor = "text-gray-600";

              if (form.isCompleted) {
                // Green for completed forms
                bgColor = "bg-green-50";
                borderColor = "border-green-200";
                statusIcon = <CheckCircle className="w-5 h-5 text-green-600" />;
                statusText = "Completed";
                statusTextColor = "text-green-700";
              } else if (form.isCompulsory) {
                // Red for compulsory and not filled
                bgColor = "bg-red-50";
                borderColor = "border-red-200";
                statusIcon = <AlertCircle className="w-5 h-5 text-red-600" />;
                statusText = "Required";
                statusTextColor = "text-red-700";
              } else {
                // Blue for not compulsory and not filled
                bgColor = "bg-blue-50";
                borderColor = "border-blue-200";
                statusIcon = <Clock className="w-5 h-5 text-blue-600" />;
                statusText = "Optional";
                statusTextColor = "text-blue-700";
              }

              return (
                <div
                  key={form.id}
                  className={`p-4 border rounded-lg ${bgColor} ${borderColor} hover:shadow-md transition-shadow`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {form.title}
                        </h3>
                        <div className="flex items-center space-x-1">
                          {statusIcon}
                          <span
                            className={`text-sm font-medium ${statusTextColor}`}
                          >
                            {statusText}
                          </span>
                        </div>
                        {form.isCompulsory && (
                          <Badge variant="destructive" className="text-xs">
                            Required
                          </Badge>
                        )}
                      </div>
                      {form.description && (
                        <p className="text-gray-600 mb-3 text-sm">
                          {form.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>
                          Created{" "}
                          {new Date(form.createdAt).toLocaleDateString()}
                        </span>
                        {form.completedAt && (
                          <>
                            <span>•</span>
                            <span>
                              Completed{" "}
                              {new Date(form.completedAt).toLocaleDateString()}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {form.isCompleted ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/forms/${form.id}/view`)}
                          className="flex items-center space-x-1"
                        >
                          <FormInput className="w-4 h-4" />
                          <span>View Submission</span>
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => router.push(`/forms/${form.id}/fill`)}
                          className={`flex items-center space-x-1 ${
                            form.isCompulsory
                              ? "bg-red-600 hover:bg-red-700"
                              : "bg-blue-600 hover:bg-blue-700"
                          }`}
                        >
                          <FormInput className="w-4 h-4" />
                          <span>Fill Form</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <FormInput className="w-16 h-16 mx-auto mb-4 text-gray-300 opacity-20" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Forms Available
              </h3>
              <p className="text-gray-500">
                There are no forms assigned to you at the moment.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
