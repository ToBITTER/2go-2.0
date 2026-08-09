"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe } from "@/lib/api";

type AuthGateProps = {
  redirectTo: string;
  children: React.ReactNode;
};

export function AuthGate({ redirectTo, children }: AuthGateProps) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        await getMe();
        router.replace(redirectTo);
      } catch {
        setReady(true);
      }
    })();
  }, [redirectTo, router]);

  if (!ready) {
    return null;
  }

  return children;
}
