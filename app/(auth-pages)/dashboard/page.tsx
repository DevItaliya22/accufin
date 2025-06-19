"use client";

import type React from "react";
import { useSession } from "next-auth/react";
import AdminDashboard from "./_components/admin/AdminDashboard";
import UserDashboard from "./_components/user/UserDashboard";

export default function LoginPage() {
  const { data: session } = useSession();
  const user = session?.user;

  if (user?.isAdmin) {
    return <AdminDashboard />;
  } else {
    return <UserDashboard />;
  }
}
