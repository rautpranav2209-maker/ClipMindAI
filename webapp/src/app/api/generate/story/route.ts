import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function generateStory(idea: string) {
  return {
    hook: `${idea} — but no one expected what happened next.`,
    twist: "Just when everything seemed lost, a single moment changed everything.",
    ending: "The world would never forget that day — and neither would they.",
    duration: 28,
  };
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId, idea } = await req.json();
  const story = generateStory(idea);

  if (projectId) {
    await prisma.project.updateMany({
      where: { id: projectId, userId: session.user.id },
      data: { idea, story },
    });
  }

  return NextResponse.json({ story });
}
