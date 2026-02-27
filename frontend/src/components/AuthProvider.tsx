"use client";

import { useAuthStore } from "@/lib/store";
import { useEffect } from "react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const setUnauthenticated = useAuthStore((state) => state.setUnauthenticated);

  useEffect(() => {
    checkAuth();

    const revalidateAuth = () => {
      void checkAuth();
    };

    const handleAuthExpired = () => {
      setUnauthenticated();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        revalidateAuth();
      }
    };

    const handleWindowFocus = () => {
      revalidateAuth();
    };

    window.addEventListener("auth:expired", handleAuthExpired);
    window.addEventListener("focus", handleWindowFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const intervalId = window.setInterval(revalidateAuth, 60 * 1000);

    return () => {
      window.removeEventListener("auth:expired", handleAuthExpired);
      window.removeEventListener("focus", handleWindowFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.clearInterval(intervalId);
    };
  }, [checkAuth, setUnauthenticated]);

  return <>{children}</>;
}
