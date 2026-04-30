import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId, clips, captions, voice, music, transitions } = await req.json();

  const editConfig = {
    clips,
    captions,
    voice,
    music: music || { track: "uplifting-01", volume: 0.3 },
    transitions: transitions || "fade",
    outputFormat: "mp4",
    resolution: "1080x1920",
    fps: 30,
    status: "ready",
  };

  const mockVideoUrl = `https://example.com/mock-final-reel-${projectId}.mp4`;

  if (projectId) {
    await prisma.project.updateMany({
      where: { id: projectId, userId: session.user.id },
      data: {
        editConfig,
        videoUrl: mockVideoUrl,
        status: "COMPLETED",
      },
    });
  }

  return NextResponse.json({ editConfig, videoUrl: mockVideoUrl });
}
