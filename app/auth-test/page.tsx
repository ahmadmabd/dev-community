import { auth } from "@/auth";

export default async function AuthTestPage() {
  const session = await auth();

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold">Authentication Test</h1>

      {session?.user ? (
        <div className="mt-5">
          <p>Welcome, {session.user.name}</p>
          <p>Email: {session.user.email}</p>
        </div>
      ) : (
        <p className="mt-5">You are not signed in.</p>
      )}
    </main>
  );
}
