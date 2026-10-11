import Link from "next/link";

const navLinks = [
  { label: "Explore", href: "/" },
  { label: "Communities", href: "/communities" },
  { label: "Blogs", href: "/blogs" },
  { label: "Developers", href: "/developers" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#090d16]/90 backdrop-blur-xl">
      <nav className="mx-auto flex min-h-18 max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 text-xl font-bold tracking-tight"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-lg text-white">
            &lt;/&gt;
          </span>
          <span>
            Dev<span className="text-violet-400">Community</span>
          </span>
        </Link>

        <div className="flex flex-wrap items-center gap-5 text-sm text-slate-300">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-violet-400"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link
          href="/login"
          className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500"
        >
          Sign In
        </Link>
      </nav>
    </header>
  );
}
