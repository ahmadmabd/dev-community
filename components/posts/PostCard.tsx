import Link from "next/link";
type PostCardProps = {
  slug: string;
  title: string;
  excerpt: string;
  authorName: string;
  topics: string[];
  createdAt: string;
};

export default function PostCard({
  slug,
  title,
  excerpt,
  authorName,
  topics,
  createdAt,
}: PostCardProps) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-violet-500/30">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-violet-300">{authorName}</p>

        <time className="text-xs text-slate-500" dateTime={createdAt}>
          {new Date(createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </time>
      </div>

      <Link href={`/posts/${slug}`}>
        <h3 className="text-2xl font-bold text-white transition-colors hover:text-purple-400">
          {title}
        </h3>
      </Link>

      <p className="mt-3 text-sm leading-7 text-slate-400">{excerpt}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {topics.map((topic) => (
          <span
            key={topic}
            className="rounded-full bg-violet-500/10 px-3 py-1 text-xs text-violet-300"
          >
            #{topic}
          </span>
        ))}
      </div>
    </article>
  );
}
