import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const [projects, subscription, total, completed, drafts] = await Promise.all([
    prisma.project.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
    prisma.subscription.findUnique({ where: { userId } }),
    prisma.project.count({ where: { userId } }),
    prisma.project.count({ where: { userId, status: "COMPLETED" } }),
    prisma.project.count({ where: { userId, status: "DRAFT" } }),
  ]);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-jakarta">Dashboard</h1>
        <p className="text-slate-400 mt-1">Welcome back, {session?.user?.name || "Creator"}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card">
          <p className="text-sm text-slate-400">Total Projects</p>
          <p className="text-3xl font-bold mt-1">{total}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-400">Completed Reels</p>
          <p className="text-3xl font-bold mt-1 text-violet-400">{completed}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-400">Drafts</p>
          <p className="text-3xl font-bold mt-1 text-slate-300">{drafts}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">Recent Projects</h2>
        <Link href="/projects" className="text-sm text-violet-400 hover:text-violet-300">
          View all →
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-slate-400 mb-4">No projects yet. Create your first reel!</p>
          <Link href="/generate" className="btn-primary">
            ✨ New Reel
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((p) => (
            <Link
              key={p.id}
              href={`/projects/${p.id}`}
              className="card flex items-center justify-between hover:border-violet-500/50 transition-colors"
            >
              <div>
                <p className="font-medium">{p.title}</p>
                <p className="text-sm text-slate-500 mt-0.5">
                  {new Date(p.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  p.status === "COMPLETED"
                    ? "bg-green-500/20 text-green-400"
                    : p.status === "PROCESSING"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-slate-700/50 text-slate-400"
                }`}
              >
                {p.status}
              </span>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 card bg-gradient-to-r from-violet-600/10 to-violet-600/5 border-violet-500/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">
              Current plan:{" "}
              <span className="text-violet-400">{subscription?.plan || "FREE"}</span>
            </p>
            <p className="text-sm text-slate-400 mt-1">
              {subscription?.plan === "FREE"
                ? "Upgrade to unlock unlimited reels"
                : "You have full access"}
            </p>
          </div>
          {subscription?.plan === "FREE" && (
            <Link href="/billing" className="btn-primary">
              Upgrade
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
