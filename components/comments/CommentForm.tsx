"use client";

import { useState } from "react";

type Props = {
  postSlug: string;
  onSuccess: () => void;
};

export default function CommentForm({ postSlug, onSuccess }: Props) {
  // Your implementation
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedContent = content.trim();
    if (!trimmedContent) {
      setError("Comment cannot be empty");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/posts/${postSlug}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: trimmedContent,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to post comment");
      }
      setContent("");
      onSuccess();
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your comment..."
          maxLength={2000}
          rows={5}
          className="block min-h-32 w-full resize-y rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-base leading-6 text-white shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      {error && (
        <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <span className="text-xs text-slate-400">
          {content.length} / 2000 characters
        </span>

        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/10 transition-all duration-200 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-600/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post Comment"}
        </button>
      </div>
    </form>
  );
}
