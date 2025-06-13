"use client";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
export default function DashboardPage() {
  const [session, setSession] = useState<any | null>(null);
  const { data: sessionData } = useSession();
  const router = useRouter();
  useEffect(() => {
    setSession(sessionData);
  }, [sessionData]);
  return (
    <div>
        <div>Email: {session?.user?.email}</div>
      <div>isAdmin: {String(session?.user?.isAdmin)}</div>
      <pre>{JSON.stringify(session?.user, null, 2)}</pre>
      <div className="cursor-pointer text-blue-500" onClick={async () => {
                        await signOut({ redirect: false });
                        router.push('/login');
                    }}>Sign out</div>
    </div>
  );
}
