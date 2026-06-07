"use client";

import { useEffect } from "react";

export default function ViewTracker({ resourceId }: { resourceId: string }) {
  useEffect(() => {
    fetch("/api/profile/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resourceId }),
    }).catch(() => {/* non bloquant */});
  }, [resourceId]);

  return null;
}
