import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";
import { signIn } from "@/auth";

export default function LoginPage() {
  return (
    <main className="flex min-h-[85vh] items-center justify-center px-5 py-12">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl">
        <h1 className="text-center text-3xl font-bold text-white">
          Welcome Back
        </h1>

        <p className="mt-3 text-center text-sm text-slate-400">
          Sign in to your DevCommunity account
        </p>

        <LoginForm />

        <div className="my-7 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-slate-400">OR</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>
        <form
          action={async () => {
            "use server";

            await signIn("google", {
              redirectTo: "/",
            });
          }}
        >
          <button
            type="submit"
            className="w-full rounded-xl border border-white/15 bg-white/10 px-5 py-3 font-semibold text-white transition hover:bg-white/15"
          >
            Continue with Google
          </button>
        </form>
        <form
          action={async () => {
            "use server";
            await signIn("github", { redirectTo: "/" });
          }}
        >
          <button
            type="submit"
            className="w-full rounded-xl border border-white/15 bg-white/10 px-5 py-3 font-semibold text-white transition hover:bg-white/15"
          >
            Continue with GitHub
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-slate-400">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-violet-400">
            Sign Up
          </Link>
        </p>
      </div>
    </main>
  );
}
