import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  // Prevent unauthenticated users from accessing the dashboard
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-bold text-white">Dashboard</h1>

      <p className="mt-4 text-slate-300">
        Welcome, {session.user.name ?? session.user.email}!
      </p>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold text-white">
          Your DevCommunity Dashboard
        </h2>

        <p className="mt-3 text-slate-400">
          Here you will manage your communities, posts, and activity.
        </p>
      </div>
    </main>
  );
}
