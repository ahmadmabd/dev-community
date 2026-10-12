import Link from "next/link";
type Props = {
  name: string;
  slug: string;
  description: string;
  topics: string[];
};
const CommunityCard = ({ name, slug, description, topics }: Props) => {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-1 hover:border-violet-500/40 hover:bg-white/[0.05]">
      <h3>{name}</h3>
      <p className="text-slate-400">{description}</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {topics.map((topic) => (
          <li
            key={topic}
            className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300"
          >
            {topic}
          </li>
        ))}
      </ul>
      <Link
        href={`/communities/${slug}`}
        className="mt-5 inline-block rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-500"
      >
        View Community
      </Link>
    </div>
  );
};

export default CommunityCard;
