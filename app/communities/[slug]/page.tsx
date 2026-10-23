import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Community from "@/models/Community";
import Membership from "@/models/Membership";
import User from "@/models/User";
import MembershipButton from "@/components/communities/MembershipButton";
import { notFound } from "next/navigation";
import Link from "next/link";
import Post from "@/models/Post";
import PostCard from "@/components/posts/PostCard";
import PostComposer from "@/components/posts/PostComposer";
type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CommunityDetailPage({ params }: Props) {
  const { slug } = await params;

  const session = await auth();

  await connectDB();

  const community = await Community.findOne({ slug }).lean();

  if (!community) {
    notFound();
  }

  const membersCount = await Membership.countDocuments({
    community: community._id,
  });

  let isMember = false;

  if (session?.user?.email) {
    const user = await User.findOne({
      email: session.user.email.toLowerCase(),
    });

    if (user) {
      const membership = await Membership.exists({
        user: user._id,
        community: community._id,
      });

      isMember = Boolean(membership);
    }
  }
  const posts = await Post.find({
    community: community._id,
    status: "PUBLISHED",
  })
    .sort({ createdAt: -1 })
    .limit(20)
    .populate("author", "name")
    .lean();

  const formattedPosts = posts.map((post) => {
    const author = post.author as unknown as {
      name?: string;
    } | null;

    return {
      id: post._id.toString(),
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      authorName: author?.name ?? "Unknown user",
      topics: post.topics,
      createdAt: post.createdAt.toISOString(),
    };
  });
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
      <Link
        href="/communities"
        className="text-violet-400 hover:text-violet-300"
      >
        &larr; Back to Communities
      </Link>

      <h1 className="mt-8 text-3xl font-bold">{community.name}</h1>

      <p className="mt-4 text-lg text-slate-400">{community.description}</p>

      <ul className="mt-6 flex flex-wrap gap-2">
        {community.topics.map((topic) => (
          <li
            key={topic}
            className="rounded-full bg-violet-500/10 px-3 py-1 text-sm text-violet-300"
          >
            #{topic}
          </li>
        ))}
      </ul>

      <p className="mt-6 text-sm text-slate-400">
        {membersCount} member{membersCount !== 1 ? "s" : ""}
      </p>

      <MembershipButton
        slug={slug}
        initialIsMember={isMember}
        isLoggedIn={Boolean(session?.user)}
      />
      {isMember && <PostComposer communitySlug={slug} />}
      <div className="mt-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Community Posts</h2>

          <span className="text-sm text-slate-400">Latest discussions</span>
        </div>

        {formattedPosts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-10 text-center">
            <h3 className="text-lg font-semibold text-white">No posts yet</h3>

            <p className="mt-2 text-sm text-slate-400">
              Be the first to share something with this community.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {formattedPosts.map((post) => (
              <PostCard
                key={post.id}
                slug={post.slug}
                title={post.title}
                excerpt={post.excerpt}
                authorName={post.authorName}
                topics={post.topics}
                createdAt={post.createdAt}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
