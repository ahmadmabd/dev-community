"use client";

import { useState, useEffect } from "react";
import { PenLine, Users, X } from "lucide-react";
import CreatePostForm from "@/components/posts/CreatePostForm";

type Props = {
  communitySlug: string;
};

export default function PostComposer({ communitySlug }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!isOpen) return;
      if (event.key === "Escape") {
        closeModal();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);
  return (
    <>
      {/* Post Composer Card */}
      <div className="mt-10 rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-black/10 transition hover:border-white/20">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400">
            <PenLine size={22} />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white">
              Share with your community
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-400">
              Have a question, idea, or something useful to share?
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-4 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Users size={16} />
            <span>Community discussion</span>
          </div>

          <button
            type="button"
            onClick={openModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 active:translate-y-0"
          >
            <PenLine size={17} />
            Write a Post
          </button>
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div
          onClick={closeModal}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Create a Post"
            onClick={(event) => event.stopPropagation()}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-slate-950 p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white">Create a Post</h2>

                <p className="mt-1 text-sm text-slate-400">
                  Share your knowledge with the community.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Close modal"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <CreatePostForm
              communitySlug={communitySlug}
              onSuccess={closeModal}
            />
          </div>
        </div>
      )}
    </>
  );
}
