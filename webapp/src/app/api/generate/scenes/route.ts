import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function generateScenes(story: any) {
  return [
    {
      id: 1,
      duration: 5,
      description: story.hook,
      cameraAngle: "Close-up",
      mood: "Tense",
      prompt: `Cinematic close-up: ${story.hook}. Dramatic lighting, emotional.`,
    },
    {
      id: 2,
      duration: 8,
      description: "Rising action — building suspense",
      cameraAngle: "Medium shot",
      mood: "Suspenseful",
      prompt: "Wide cinematic shot, character facing obstacle, golden hour lighting.",
    },
    {
      id: 3,
      duration: 8,
      description: story.twist,
      cameraAngle: "Wide shot",
      mood: "Shocking",
      prompt: `Plot twist moment: ${story.twist}. Camera pull back, dramatic music cue.`,
    },
    {
      id: 4,
      duration: 7,
      description: story.ending,
      cameraAngle: "Aerial",
      mood: "Triumphant",
      prompt: `Resolution: ${story.ending}. Warm colors, uplifting.`,
    },
  ];
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId, story } = await req.json();
  const scenes = generateScenes(story);

  if (projectId) {
    await prisma.project.updateMany({
      where: { id: projectId, userId: session.user.id },
      data: { scenes, story },
    });
  }

  return NextResponse.json({ scenes });
}
