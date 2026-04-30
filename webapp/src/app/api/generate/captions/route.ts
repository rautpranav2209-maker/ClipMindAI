import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function generateCaptions(story: any, scenes: any[]) {
  const words = `${story.hook} ${story.twist} ${story.ending}`.split(" ");
  const captionsPerScene = Math.ceil(words.length / scenes.length);

  return scenes.map((scene: any, i: number) => ({
    sceneId: scene.id,
    startTime: scenes.slice(0, i).reduce((sum: number, s: any) => sum + s.duration, 0),
    endTime: scenes.slice(0, i + 1).reduce((sum: number, s: any) => sum + s.duration, 0),
    text: words.slice(i * captionsPerScene, (i + 1) * captionsPerScene).join(" "),
    style: { font: "Inter", size: 32, color: "#ffffff", background: "rgba(0,0,0,0.5)" },
  }));
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId, story, scenes } = await req.json();
  const captions = generateCaptions(story, scenes);

  if (projectId) {
    await prisma.project.updateMany({
      where: { id: projectId, userId: session.user.id },
      data: { captions },
    });
  }

  return NextResponse.json({ captions });
}
