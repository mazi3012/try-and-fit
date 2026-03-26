"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ActionButtons({
  appId,
  userId,
}: {
  appId: string;
  userId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);

  const handleAction = async (action: "approve" | "reject") => {
    setLoading(action);
    try {
      const res = await fetch(`/api/admin/applications/${appId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) {
        const { error } = await res.json();
        alert(`Error: ${error}`);
        return;
      }
      router.refresh();
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex gap-2 shrink-0">
      <button
        onClick={() => handleAction("approve")}
        disabled={!!loading}
        className="h-9 px-4 rounded-xl bg-green-500 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 hover:bg-green-600 transition-colors disabled:opacity-50"
      >
        {loading === "approve" ? (
          <Loader2 size={13} className="animate-spin" />
        ) : (
          <CheckCircle size={13} />
        )}
        Approve
      </button>
      <button
        onClick={() => handleAction("reject")}
        disabled={!!loading}
        className="h-9 px-4 rounded-xl bg-red-50 text-red-500 border border-red-200 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 hover:bg-red-100 transition-colors disabled:opacity-50"
      >
        {loading === "reject" ? (
          <Loader2 size={13} className="animate-spin" />
        ) : (
          <XCircle size={13} />
        )}
        Reject
      </button>
    </div>
  );
}
