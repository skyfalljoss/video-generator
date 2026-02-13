
import { UserButton } from "@clerk/nextjs";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <nav className="flex items-center justify-between border-b border-white/10 px-8 py-4">
        <h1 className="text-xl font-bold">ShortsGen AI</h1>
        <UserButton afterSignOutUrl="/" />
      </nav>
      <main className="flex flex-1 flex-col items-center justify-center p-8">
        <h2 className="text-3xl font-bold">Welcome to your Dashboard</h2>
        <p className="mt-4 text-zinc-400">
          This is where you&apos;ll manage your AI video generation projects.
        </p>
      </main>
    </div>
  );
}
