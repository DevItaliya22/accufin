"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader } from "@/components/ui/loader";
import FormBuilder from "../../_components/FormBuilder";
import DashboardHeader from "../../../_components/admin/DashboardHeader";
import { signOut } from "next-auth/react";

export default function EditFormPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    if (!session.user?.isAdmin) {
      router.push("/404");
      return;
    }

    setLoading(false);
  }, [session, status, router]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
    router.push("/login");
  };

  const handleTabChange = (tab: string) => {
    if (tab === "forms") {
      router.push("/dashboard");
    } else {
      router.push("/dashboard");
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader size={48} className="mb-4 text-blue-500" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session?.user?.isAdmin) {
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

  return (
    <div className="min-h-screen bg-cyan-50">
      {/* <DashboardHeader
        activeTab="forms"
        onTabChange={handleTabChange}
        onLogout={handleLogout}
      /> */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <FormBuilder mode="edit" formId={params.id as string} />
      </div>
    </div>
  );
}
