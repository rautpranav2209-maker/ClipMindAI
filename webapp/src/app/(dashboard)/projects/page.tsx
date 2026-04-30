"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

type Project = {
  id: string;
  title: string;
  status: string;
  idea: string | null;
  updatedAt: string;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      });
  }, []);

  async function deleteProject(id: string) {
    if (!confirm("Delete this project?")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold font-jakarta">My Projects</h1>
        <Link href="/generate" className="btn-primary">
          ✨ New Reel
        </Link>
      </div>

      {loading ? (
        <div className="text-slate-400">Loading…</div>
      ) : projects.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-slate-400 mb-4">No projects yet</p>
          <Link href="/generate" className="btn-primary">
            Create your first reel
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <div key={p.id} className="card hover:border-violet-500/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    p.status === "COMPLETED"
                      ? "bg-green-500/20 text-green-400"
                      : p.status === "PROCESSING"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-slate-700/50 text-slate-400"
                  }`}
                >
                  {p.status}
                </span>
                <button
                  onClick={() => deleteProject(p.id)}
                  className="text-slate-600 hover:text-red-400 text-xs"
                >
                  Delete
                </button>
              </div>
              <h3 className="font-semibold mb-1">{p.title}</h3>
              {p.idea && (
                <p className="text-sm text-slate-500 line-clamp-2 mb-3">{p.idea}</p>
              )}
              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-slate-600">
                  {new Date(p.updatedAt).toLocaleDateString()}
                </p>
                <Link
                  href={`/projects/${p.id}`}
                  className="text-sm text-violet-400 hover:text-violet-300"
                >
                  Open →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
