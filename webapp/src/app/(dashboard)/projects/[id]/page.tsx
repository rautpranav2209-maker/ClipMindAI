"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<any>(null);
  const [posting, setPosting] = useState(false);
  const [socialAccounts, setSocialAccounts] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/projects/${id}`).then((r) => r.json()).then(setProject);
    fetch("/api/social/connect").then((r) => r.json()).then(setSocialAccounts);
  }, [id]);

  async function handlePost(platform: string) {
    setPosting(true);
    await fetch("/api/social/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: id, platforms: [platform] }),
    });
    setPosting(false);
    alert(`Posted to ${platform}!`);
  }

  if (!project) return <div className="p-8 text-slate-400">Loading…</div>;

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/projects" className="text-slate-500 hover:text-white text-sm">
          ← Projects
        </Link>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-jakarta">{project.title}</h1>
          {project.idea && <p className="text-slate-400 mt-1">{project.idea}</p>}
        </div>
        <span
          className={`text-xs px-3 py-1.5 rounded-full font-medium ${
            project.status === "COMPLETED"
              ? "bg-green-500/20 text-green-400"
              : "bg-slate-700/50 text-slate-400"
          }`}
        >
          {project.status}
        </span>
      </div>

      {project.story && (
        <div className="card mb-4">
          <h2 className="font-semibold mb-3">Story</h2>
          <div className="space-y-2 text-sm text-slate-300">
            <p><span className="text-violet-400 font-medium">Hook:</span> {(project.story as any).hook}</p>
            <p><span className="text-violet-400 font-medium">Twist:</span> {(project.story as any).twist}</p>
            <p><span className="text-violet-400 font-medium">Ending:</span> {(project.story as any).ending}</p>
          </div>
        </div>
      )}

      {project.scenes && (
        <div className="card mb-4">
          <h2 className="font-semibold mb-3">Scenes ({(project.scenes as any[]).length})</h2>
          <div className="space-y-2">
            {(project.scenes as any[]).map((s: any) => (
              <div key={s.id} className="bg-[#080a12] rounded-lg p-3 text-sm">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-violet-400 text-xs">Scene {s.id}</span>
                  <span className="text-slate-600 text-xs">{s.duration}s · {s.cameraAngle}</span>
                </div>
                <p className="text-slate-300">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {project.videoUrl && (
        <div className="card mb-4">
          <h2 className="font-semibold mb-3">Final Reel</h2>
          <p className="text-sm text-slate-400 mb-2">{project.videoUrl}</p>
          <div className="flex gap-3 mt-4">
            <h3 className="text-sm font-medium mb-2 w-full">Auto-post to:</h3>
          </div>
          <div className="flex gap-3">
            {["YOUTUBE", "INSTAGRAM"].map((platform) => {
              const connected = socialAccounts.find(
                (a) => a.platform === platform && a.connected
              );
              return (
                <button
                  key={platform}
                  onClick={() => handlePost(platform)}
                  disabled={!connected || posting}
                  className={`btn-secondary text-sm ${!connected ? "opacity-50 cursor-not-allowed" : ""}`}
                  title={!connected ? `Connect ${platform} in Settings first` : ""}
                >
                  {posting ? "Posting…" : `Post to ${platform}`}
                </button>
              );
            })}
          </div>
          {socialAccounts.length === 0 && (
            <p className="text-xs text-slate-500 mt-2">
              <Link href="/settings" className="text-violet-400">Connect social accounts</Link> to enable auto-posting
            </p>
          )}
        </div>
      )}

      {project.status !== "COMPLETED" && (
        <Link href={`/generate?projectId=${id}`} className="btn-primary">
          Continue in Generator →
        </Link>
      )}
    </div>
  );
}
