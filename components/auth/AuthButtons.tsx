import Link from "next/link";
import { auth, signOut } from "@/auth";

export default async function AuthButtons() {
  const session = await auth();

  return (
    <div className="flex flex-wrap items-center gap-3">
      {session?.user ? (
        <>
          <p className="text-sm text-slate-300">Welcome, {session.user.name}</p>

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500"
            >
              Sign Out
            </button>
          </form>
        </>
      ) : (
        <Link
          href="/login"
          className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500"
        >
          Sign In
        </Link>
      )}
    </div>
  );
}
