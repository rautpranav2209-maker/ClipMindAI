import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function generateClipForScene(scene: any): Promise<string> {
  // TODO: Replace with real Pika API call:
  // const response = await fetch("https://api.pika.art/v1/generate", {
  //   method: "POST",
  //   headers: { Authorization: `Bearer ${process.env.PIKA_API_KEY}` },
  //   body: JSON.stringify({ prompt: scene.prompt, duration: scene.duration }),
  // });
  // const data = await response.json();
  // return data.video_url;
  return `https://example.com/mock-clip-${scene.id}.mp4`;
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId, scenes } = await req.json();

  const clips = await Promise.all(
    scenes.map(async (scene: any) => ({
      sceneId: scene.id,
      videoUrl: await generateClipForScene(scene),
      duration: scene.duration,
      status: "ready",
    }))
  );

  if (projectId) {
    await prisma.project.updateMany({
      where: { id: projectId, userId: session.user.id },
      data: { clips },
    });
  }

  return NextResponse.json({ clips });
}
