// e-post_hub\app\Unauthorized.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Unauthorized() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const msg = query.get("message");
    if (msg) {
      setMessage(msg);
    } else {
      setMessage("Unauthorized access. You do not have permission to view this page.");
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-semibold text-red-500">Access Denied</h1>
      {message && (
        <p className="mt-4 text-lg text-gray-700">
          {message}
        </p>
      )}
      <button
        onPress={() => router.push("/")}
        className="mt-8 px-6 py-2 bg-gradient-to-r from-[#f7960d] to-[#f95d09] text-white rounded"
      >
        Go to Home
      </button>
    </div>
  );
}
