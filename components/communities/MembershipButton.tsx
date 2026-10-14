"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Props = {
  slug: string;
  initialIsMember: boolean;
  isLoggedIn: boolean;
};

export default function MembershipButton({
  slug,
  initialIsMember,
  isLoggedIn,
}: Props) {
  const router = useRouter();

  const [isMember, setIsMember] = useState(initialIsMember);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isLoggedIn) {
    return (
      <Link
        href="/login"
        className="inline-block rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-500"
      >
        Sign in to Join
      </Link>
    );
  }

  async function handleMembership() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/communities/${encodeURIComponent(slug)}/${isMember ? "leave" : "join"}`,
        {
          method: isMember ? "DELETE" : "POST",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setIsMember(!isMember);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={handleMembership}
        disabled={loading}
        className={`rounded-xl px-6 py-3 font-semibold transition disabled:opacity-50 ${
          isMember
            ? "border border-white/20 bg-white/10 text-white hover:bg-white/15"
            : "bg-violet-600 text-white hover:bg-violet-500"
        }`}
      >
        {loading
          ? "Please wait..."
          : isMember
            ? "Leave Community"
            : "Join Community"}
      </button>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
    </div>
  );
}
