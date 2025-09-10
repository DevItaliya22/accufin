"use client";
import { useState, useEffect } from "react";
import { FaTimes, FaCalendarAlt } from "react-icons/fa";
import { ImportantDate } from "@/lib/generated/prisma";

interface ImportantDatesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ImportantDatesModal({
  isOpen,
  onClose,
}: ImportantDatesModalProps) {
  const [importantDates, setImportantDates] = useState<ImportantDate[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchImportantDates();
    }
  }, [isOpen]);

  const fetchImportantDates = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/user/important-dates");
      const data = await response.json();
      setImportantDates(data);
    } catch (error) {
      console.error("Error fetching important dates:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDaysUntil = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays > 0) return `${diffDays} days from now`;
    return "Past due";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <FaCalendarAlt className="text-[#007399] text-2xl mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">
              Important Dates
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007399]"></div>
            </div>
          ) : importantDates.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FaCalendarAlt className="text-4xl mx-auto mb-4 text-gray-300" />
              <p className="text-lg">No upcoming important dates</p>
            </div>
          ) : (
            <div className="space-y-4">
              {importantDates.map((date) => (
                <div
                  key={date.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-800 mb-1">
                        {date.title}
                      </h3>
                      {date.description && (
                        <p className="text-gray-600 mb-2 whitespace-pre-wrap">{date.description}</p>
                      )}
                      <div className="flex items-center text-sm text-gray-500">
                        <FaCalendarAlt className="mr-2 text-[#007399]" />
                        <span>{formatDate(date.date)}</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          getDaysUntil(date.date) === "Today"
                            ? "bg-red-100 text-red-800"
                            : getDaysUntil(date.date) === "Tomorrow"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {getDaysUntil(date.date)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#007399] text-white rounded hover:bg-[#005a7a] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
