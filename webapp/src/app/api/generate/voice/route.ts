import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function generateVoiceover(text: string): Promise<string> {
  // TODO: Replace with real ElevenLabs API call:
  // const voiceId = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM";
  // const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
  //   method: "POST",
  //   headers: {
  //     "xi-api-key": process.env.ELEVENLABS_API_KEY!,
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({ text, model_id: "eleven_monolingual_v1" }),
  // });
  // const buffer = await response.arrayBuffer();
  // return audioUrl;
  void text;
  return `https://example.com/mock-voice.mp3`;
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId, story } = await req.json();

  const fullText = `${story.hook} ${story.twist} ${story.ending}`;
  const audioUrl = await generateVoiceover(fullText);

  const voiceData = {
    audioUrl,
    text: fullText,
    voiceId: process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM",
    status: "ready",
  };

  if (projectId) {
    await prisma.project.updateMany({
      where: { id: projectId, userId: session.user.id },
      data: { voice: voiceData },
    });
  }

  return NextResponse.json({ voice: voiceData });
}
