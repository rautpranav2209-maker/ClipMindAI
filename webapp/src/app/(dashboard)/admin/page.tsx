import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold font-jakarta mb-2">Admin Panel</h1>
      <p className="text-slate-400 mb-8">Platform overview</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Users", color: "text-white" },
          { label: "Total Projects", color: "text-white" },
          { label: "Pro Subscribers", color: "text-violet-400" },
          { label: "Studio Subscribers", color: "text-violet-400" },
        ].map((stat) => (
          <div key={stat.label} className="card">
            <p className="text-xs text-slate-400">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>—</p>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="font-semibold mb-4">API Endpoints</h2>
        <div className="mt-3 space-y-2">
          <code className="block bg-[#080a12] rounded-lg p-3 text-xs text-violet-300">
            GET /api/admin/stats
          </code>
          <code className="block bg-[#080a12] rounded-lg p-3 text-xs text-violet-300">
            GET /api/admin/users?page=1
          </code>
        </div>
      </div>
    </div>
  );
}
