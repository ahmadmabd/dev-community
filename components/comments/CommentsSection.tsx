"use client";

import { useEffect, useState } from "react";
import CommentForm from "./CommentForm";

type Props = {
  postSlug: string;
};

type CommentData = {
  _id: string;
  content: string;
  author: {
    name: string;
    image?: string | null;
  } | null;
  createdAt: string;
};

export default function CommentsSection({ postSlug }: Props) {
  // Your implementation
  const [comments, setComments] = useState<CommentData[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    console.log("Loading comments for:", postSlug);
    async function loadComments() {
      setLoading(true);
      setError("");
      try {
        // Fetch comments here
        const response = await fetch(`/api/posts/${postSlug}/comments`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error("Failed to load comments");
        }
        const data = await response.json();
        setComments(data.comments);
      } catch (error) {
        if (controller.signal.aborted) return;
        setError("Something went wrong. Please try again.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }
    loadComments();
    return () => {
      controller.abort();
    };
  }, [postSlug, refreshKey]);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Discussion</h2>

        <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-blue-300">
          {comments.length} comments
        </span>
      </div>

      {loading && <p className="text-sm text-slate-400">Loading comments...</p>}

      {error && (
        <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </p>
      )}

      {!loading && !error && comments.length === 0 && (
        <p className="rounded-xl border border-dashed border-slate-700 p-6 text-center text-slate-400">
          No comments yet. Be the first to comment!
        </p>
      )}

      {!loading && !error && (
        <div className="divide-y divide-slate-800">
          {comments.map((comment) => (
            <article key={comment._id} className="flex gap-4 py-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                {comment.author?.name?.charAt(0).toUpperCase() ?? "?"}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold text-white">
                    {comment.author?.name ?? "Unknown user"}
                  </h3>

                  <time className="text-xs text-slate-400">
                    {new Date(comment.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                </div>

                <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-7 text-slate-300">
                  {comment.content}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="border-t border-slate-800 pt-6">
        <h3 className="mb-4 font-semibold text-white">Join the discussion</h3>

        <CommentForm
          postSlug={postSlug}
          onSuccess={() => {
            setRefreshKey((previous) => previous + 1);
          }}
        />
      </div>
    </section>
  );
}
