"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const STEPS = ["Idea", "Story", "Scenes", "Clips", "Voice", "Captions", "Edit"];

function GenerateWizard() {
  const router = useRouter();
  const params = useSearchParams();
  const existingProjectId = params.get("projectId");

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(existingProjectId);

  const [idea, setIdea] = useState("");
  const [title, setTitle] = useState("");
  const [story, setStory] = useState<any>(null);
  const [scenes, setScenes] = useState<any[]>([]);
  const [clips, setClips] = useState<any[]>([]);
  const [voice, setVoice] = useState<any>(null);
  const [captions, setCaptions] = useState<any[]>([]);
  const [editResult, setEditResult] = useState<any>(null);

  async function saveAndAdvance() {
    setLoading(true);

    if (step === 0) {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title || idea.slice(0, 60), idea }),
      });
      const data = await res.json();
      setProjectId(data.id);
      setStep(1);
    } else if (step === 1) {
      const res = await fetch("/api/generate/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, idea }),
      });
      const data = await res.json();
      setStory(data.story);
      setStep(2);
    } else if (step === 2) {
      const res = await fetch("/api/generate/scenes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, story }),
      });
      const data = await res.json();
      setScenes(data.scenes);
      setStep(3);
    } else if (step === 3) {
      const res = await fetch("/api/generate/clips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, scenes }),
      });
      const data = await res.json();
      setClips(data.clips);
      setStep(4);
    } else if (step === 4) {
      const res = await fetch("/api/generate/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, story }),
      });
      const data = await res.json();
      setVoice(data.voice);
      setStep(5);
    } else if (step === 5) {
      const res = await fetch("/api/generate/captions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, story, scenes }),
      });
      const data = await res.json();
      setCaptions(data.captions);
      setStep(6);
    } else if (step === 6) {
      const res = await fetch("/api/generate/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, clips, captions, voice }),
      });
      const data = await res.json();
      setEditResult(data);
      setStep(7);
    }

    setLoading(false);
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold font-jakarta mb-2">✨ New Reel</h1>
      <p className="text-slate-400 mb-8">AI-powered pipeline: idea to viral reel</p>

      <div className="flex items-center gap-1 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-1 flex-1">
            <div
              className={`h-1.5 flex-1 rounded-full ${
                i < step ? "bg-violet-500" : i === step ? "bg-violet-500/50" : "bg-[#1e2340]"
              }`}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-2 mb-8 flex-wrap">
        {STEPS.map((s, i) => (
          <span
            key={s}
            className={`text-xs px-2 py-1 rounded-lg ${
              i === step
                ? "bg-violet-600/20 text-violet-300 font-medium"
                : i < step
                ? "text-slate-500"
                : "text-slate-700"
            }`}
          >
            {s}
          </span>
        ))}
      </div>

      {step === 0 && (
        <div className="card space-y-4">
          <h2 className="font-semibold text-lg">Your Idea</h2>
          <p className="text-sm text-slate-400">Describe the story or concept for your reel</p>
          <div>
            <label className="label">Project Title (optional)</label>
            <input
              className="input"
              placeholder="My viral reel"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Idea / Concept *</label>
            <textarea
              className="input min-h-[120px] resize-none"
              placeholder="E.g. Poor boy helps a stranger and gets a surprising reward..."
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
            />
          </div>
          <button
            className="btn-primary w-full"
            onClick={saveAndAdvance}
            disabled={!idea.trim() || loading}
          >
            {loading ? "Saving…" : "Generate Story →"}
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="card space-y-4">
          <h2 className="font-semibold text-lg">Generating Story</h2>
          <p className="text-sm text-slate-400">AI is crafting your 3-act story arc</p>
          <div className="bg-[#080a12] rounded-xl p-4 text-sm text-slate-300">
            <p className="font-medium text-violet-400 mb-2">Your idea:</p>
            <p className="italic">{idea}</p>
          </div>
          <button className="btn-primary w-full" onClick={saveAndAdvance} disabled={loading}>
            {loading ? "Generating story…" : "Generate Story"}
          </button>
        </div>
      )}

      {step === 2 && story && (
        <div className="card space-y-4">
          <h2 className="font-semibold text-lg">Story Ready ✅</h2>
          <div className="space-y-2 text-sm">
            <div className="bg-[#080a12] rounded-lg p-3">
              <span className="text-violet-400 font-medium">Hook: </span>{story.hook}
            </div>
            <div className="bg-[#080a12] rounded-lg p-3">
              <span className="text-violet-400 font-medium">Twist: </span>{story.twist}
            </div>
            <div className="bg-[#080a12] rounded-lg p-3">
              <span className="text-violet-400 font-medium">Ending: </span>{story.ending}
            </div>
          </div>
          <button className="btn-primary w-full" onClick={saveAndAdvance} disabled={loading}>
            {loading ? "Planning scenes…" : "Plan Scenes →"}
          </button>
        </div>
      )}

      {step === 3 && scenes.length > 0 && (
        <div className="card space-y-4">
          <h2 className="font-semibold text-lg">Scenes Planned ✅</h2>
          <div className="space-y-2">
            {scenes.map((s) => (
              <div key={s.id} className="bg-[#080a12] rounded-lg p-3 text-sm">
                <div className="flex gap-2 mb-1 text-xs text-slate-500">
                  <span>Scene {s.id}</span>
                  <span>·</span>
                  <span>{s.duration}s</span>
                  <span>·</span>
                  <span>{s.cameraAngle}</span>
                  <span>·</span>
                  <span>{s.mood}</span>
                </div>
                <p className="text-slate-300">{s.description}</p>
              </div>
            ))}
          </div>
          <button className="btn-primary w-full" onClick={saveAndAdvance} disabled={loading}>
            {loading ? "Generating clips…" : "Generate Clips (Pika) →"}
          </button>
        </div>
      )}

      {step === 4 && clips.length > 0 && (
        <div className="card space-y-4">
          <h2 className="font-semibold text-lg">Clips Generated ✅</h2>
          <div className="space-y-2">
            {clips.map((c: any) => (
              <div key={c.sceneId} className="bg-[#080a12] rounded-lg p-3 text-sm flex items-center gap-3">
                <span className="text-green-400">✓</span>
                <span className="text-slate-300">Scene {c.sceneId} — {c.duration}s clip ready</span>
              </div>
            ))}
          </div>
          <button className="btn-primary w-full" onClick={saveAndAdvance} disabled={loading}>
            {loading ? "Generating voice…" : "Generate Voiceover (ElevenLabs) →"}
          </button>
        </div>
      )}

      {step === 5 && voice && (
        <div className="card space-y-4">
          <h2 className="font-semibold text-lg">Voiceover Ready ✅</h2>
          <div className="bg-[#080a12] rounded-lg p-4 text-sm">
            <p className="text-violet-400 font-medium mb-2">Audio track</p>
            <p className="text-slate-300 text-xs truncate">{voice.audioUrl}</p>
            <p className="text-slate-500 text-xs mt-1">{voice.text?.slice(0, 100)}…</p>
          </div>
          <button className="btn-primary w-full" onClick={saveAndAdvance} disabled={loading}>
            {loading ? "Generating captions…" : "Auto-Generate Captions →"}
          </button>
        </div>
      )}

      {step === 6 && captions.length > 0 && (
        <div className="card space-y-4">
          <h2 className="font-semibold text-lg">Captions Ready ✅</h2>
          <div className="space-y-1">
            {captions.map((c: any) => (
              <div key={c.sceneId} className="bg-[#080a12] rounded-lg p-3 text-sm flex gap-3">
                <span className="text-slate-600 text-xs w-16 shrink-0">
                  {c.startTime}s–{c.endTime}s
                </span>
                <span className="text-slate-300">{c.text}</span>
              </div>
            ))}
          </div>
          <button className="btn-primary w-full" onClick={saveAndAdvance} disabled={loading}>
            {loading ? "Editing reel…" : "Assemble Final Reel (CapCut) →"}
          </button>
        </div>
      )}

      {step === 7 && editResult && (
        <div className="card text-center space-y-6">
          <div className="text-5xl">🎬</div>
          <div>
            <h2 className="font-bold text-xl font-jakarta">Reel Complete!</h2>
            <p className="text-slate-400 mt-1">Your reel has been assembled and is ready</p>
          </div>
          <div className="bg-[#080a12] rounded-xl p-4 text-sm text-left">
            <p className="text-violet-400 font-medium mb-2">Final Video URL</p>
            <p className="text-slate-300 break-all text-xs">{editResult.videoUrl}</p>
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={() => router.push(`/projects/${projectId}`)} className="btn-primary">
              View Project →
            </button>
            <button
              onClick={() => {
                setStep(0);
                setProjectId(null);
                setIdea("");
                setTitle("");
                setStory(null);
                setScenes([]);
                setClips([]);
                setVoice(null);
                setCaptions([]);
                setEditResult(null);
              }}
              className="btn-secondary"
            >
              New Reel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GeneratePage() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-400">Loading…</div>}>
      <GenerateWizard />
    </Suspense>
  );
}
