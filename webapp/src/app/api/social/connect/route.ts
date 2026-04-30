import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { platform, accessToken, channelId, channelName } = await req.json();

  const account = await prisma.socialAccount.upsert({
    where: { userId_platform: { userId: session.user.id, platform } },
    create: {
      userId: session.user.id,
      platform,
      accessToken,
      channelId,
      channelName,
      connected: true,
    },
    update: { accessToken, channelId, channelName, connected: true },
  });

  return NextResponse.json(account);
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const accounts = await prisma.socialAccount.findMany({
    where: { userId: session.user.id },
    select: { id: true, platform: true, channelName: true, connected: true },
  });

  return NextResponse.json(accounts);
}
