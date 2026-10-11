import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#090d16]">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-8 text-center text-sm text-slate-400 md:flex-row lg:px-8">
        <p>© {new Date().getFullYear()} DevCommunity. Built for developers.</p>

        <div className="flex items-center gap-5">
          <Link href="/communities" className="hover:text-white">
            Communities
          </Link>
          <Link href="/blogs" className="hover:text-white">
            Blogs
          </Link>
          <Link href="/developers" className="hover:text-white">
            Developers
          </Link>
        </div>
      </div>
    </footer>
  );
}
