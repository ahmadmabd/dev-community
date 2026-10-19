"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type Props = {
  communitySlug: string;
  onSuccess: () => void;
};

export default function CreatePostForm({ communitySlug, onSuccess }: Props) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [topics, setTopics] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `/api/communities/${encodeURIComponent(communitySlug)}/posts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            content,
            topics: topics
              .split(",")
              .map((topic) => topic.trim())
              .filter(Boolean),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to publish post.");
      }

      setTitle("");
      setContent("");
      setTopics("");
      setSuccess("Your post was published successfully!");

      router.refresh();
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="post-title"
            className="mb-2 block text-sm text-slate-300"
          >
            Title
          </label>

          <input
            id="post-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Enter a post title"
            minLength={5}
            maxLength={200}
            required
            className="w-full rounded-xl border border-white/15 bg-slate-900 px-4 py-3 text-white outline-none focus:border-violet-500"
          />
        </div>

        <div>
          <label
            htmlFor="post-content"
            className="mb-2 block text-sm text-slate-300"
          >
            Content
          </label>

          <textarea
            id="post-content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="What would you like to share?"
            rows={6}
            minLength={10}
            required
            className="w-full resize-y rounded-xl border border-white/15 bg-slate-900 px-4 py-3 text-white outline-none focus:border-violet-500"
          />
        </div>

        <div>
          <label
            htmlFor="post-topics"
            className="mb-2 block text-sm text-slate-300"
          >
            Topics (optional)
          </label>

          <input
            id="post-topics"
            type="text"
            value={topics}
            onChange={(event) => setTopics(event.target.value)}
            placeholder="React, Next.js, JavaScript"
            className="w-full rounded-xl border border-white/15 bg-slate-900 px-4 py-3 text-white outline-none focus:border-violet-500"
          />

          <p className="mt-2 text-xs text-slate-500">
            Separate topics with commas. Maximum 5 topics.
          </p>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-400">
          {error}
        </p>
      )}

      {success && (
        <p role="status" className="mt-4 text-sm text-green-400">
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Publishing..." : "Publish Post"}
      </button>
    </form>
  );
}
