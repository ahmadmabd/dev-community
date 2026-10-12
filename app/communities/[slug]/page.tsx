import { connectDB } from "@/lib/mongodb";
import Community from "@/models/Community";
import { notFound } from "next/navigation";
import Link from "next/link";
import Membership from "@/models/Membership";
type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CommunityDetailPage({ params }: Props) {
  const { slug } = await params;
  await connectDB();
  const community = await Community.findOne({ slug }).lean();
  if (!community) {
    notFound();
  }
  const membersCount = await Membership.countDocuments({
    community: community._id,
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
    </section>
  );
}
