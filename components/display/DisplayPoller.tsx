"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function DisplayPoller() {
  const router = useRouter();

  useEffect(() => {
    const id = window.setInterval(() => {
      router.refresh();
    }, 10000);
    return () => window.clearInterval(id);
  }, [router]);

  return null;
}
