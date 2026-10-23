import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import { notFound } from "next/navigation";
import Link from "next/link";
import CommentsSection from "@/components/comments/CommentsSection";
type Props = {
  params: Promise<{ slug: string }>;
};

type PopulatedAuthor = {
  name: string;
  image?: string | null;
};

type PopulatedCommunity = {
  name: string;
  slug: string;
  image?: string | null;
};

export default async function PostDetailPage({ params }: Props) {
  const { slug } = await params;

  await connectDB();

  const post = await Post.findOne({
    slug,
    status: "PUBLISHED",
  })
    .populate<{ author: PopulatedAuthor | null }>("author", "name image")
    .populate<{ community: PopulatedCommunity | null }>(
      "community",
      "name slug image",
    );

  if (!post) {
    notFound();
  }

  const authorName = post.author?.name ?? "Unknown author";
  const communityName = post.community?.name ?? "Unknown community";

  const displayDate = post.publishedAt ?? post.createdAt;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      {/* Community */}
      <div className="mb-6">
        {post.community?.slug ? (
          <Link
            href={`/communities/${post.community.slug}`}
            className="text-sm font-medium text-blue-400 transition hover:text-blue-300"
          >
            ← {communityName}
          </Link>
        ) : (
          <span className="text-sm text-gray-400">{communityName}</span>
        )}
      </div>

      <article className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-lg sm:p-8">
        {/* Post Title */}
        <h1 className="mb-5 text-3xl font-bold leading-tight text-white sm:text-4xl">
          {post.title}
        </h1>

        {/* Author and Publication Date */}
        <div className="mb-6 flex items-center gap-3">
          {post.author?.image ? (
            <img
              src={post.author.image}
              alt={authorName}
              className="h-11 w-11 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-700 text-lg font-semibold text-white">
              {authorName.charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <p className="font-medium text-white">{authorName}</p>

            <time
              dateTime={displayDate.toISOString()}
              className="text-sm text-gray-400"
            >
              {displayDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
        </div>

        <div className="mb-7 border-t border-gray-800" />

        {/* Full Post Content */}
        <div className="whitespace-pre-wrap break-words leading-8 text-gray-200">
          {post.content}
        </div>

        {/* Topics */}
        {post.topics.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2 border-t border-gray-800 pt-6">
            {post.topics.map((topic) => (
              <span
                key={topic}
                className="rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-300"
              >
                #{topic}
              </span>
            ))}
          </div>
        )}
      </article>

      {/* Comments Section */}
      <section className="mt-8 rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-lg sm:p-8">
        <CommentsSection postSlug={slug} />
      </section>
    </main>
  );
}
