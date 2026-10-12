import Link from "next/link";

const features = [
  {
    number: "01",
    title: "Explore Communities",
    description:
      "Discover developer communities focused on your favorite technologies.",
    href: "/communities",
    linkText: "Explore communities",
  },
  {
    number: "02",
    title: "Share Knowledge",
    description:
      "Publish technical blogs, share ideas, and learn from other developers.",
    href: "/blogs",
    linkText: "Discover blogs",
  },
  {
    number: "03",
    title: "Build Your Profile",
    description: "Showcase your skills, contributions, and developer journey.",
    href: "/developers",
    linkText: "Explore developers",
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-violet-600/15 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
              A space for developers
            </span>

            <h1 className="mt-8 text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Learn together.
              <br />
              Build together.
              <br />
              <span className="text-violet-400">Grow together.</span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-400">
              Discover communities, share technical knowledge, explore developer
              blogs, and connect with people who love building software.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/communities"
                className="rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white transition hover:bg-violet-500"
              >
                Explore Communities →
              </Link>

              <Link
                href="/blogs"
                className="rounded-xl border border-white/15 px-6 py-3 font-semibold text-slate-200 transition hover:border-violet-400/50 hover:bg-white/5"
              >
                Read Blogs
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            What you can do
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything starts with community.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.number}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition duration-300 hover:-translate-y-1 hover:border-violet-500/40 hover:bg-white/[0.05]"
            >
              <span className="text-sm font-semibold text-violet-400">
                {feature.number}
              </span>

              <h3 className="mt-8 text-xl font-bold">{feature.title}</h3>

              <p className="mt-4 min-h-20 leading-7 text-slate-400">
                {feature.description}
              </p>

              <Link
                href={feature.href}
                className="mt-6 inline-flex text-sm font-semibold text-violet-300 transition group-hover:text-violet-200"
              >
                {feature.linkText} →
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
