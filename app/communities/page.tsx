import { connectDB } from "@/lib/mongodb";
import Community from "@/models/Community";
import CommunityCard from "@/components/communities/CommunityCard";
export default async function CommunitiesPage() {
  await connectDB();
  const communities = await Community.find().sort({ createdAt: -1 }).lean();
  if (communities.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <h1 className="text-3xl font-bold">Communities</h1>
        <p className="mt-4 text-lg text-slate-400">No communities found.</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
      <h1 className="text-3xl font-bold">Communities</h1>
      <p className="mt-4 text-lg text-slate-400">
        Discover and join developer communities focused on your favorite
        technologies.
      </p>
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {communities.map((community) => (
          <CommunityCard
            key={community._id.toString()}
            name={community.name}
            slug={community.slug}
            description={community.description}
            topics={community.topics}
          />
        ))}
      </div>
    </section>
  );
}
