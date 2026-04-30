import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function postToYouTube(videoUrl: string, title: string, accessToken: string): Promise<string> {
  // TODO: Replace with real YouTube Data API v3 upload
  console.log(`[MOCK] Posting to YouTube: ${title}`, videoUrl, accessToken);
  return `youtube_video_${Date.now()}`;
}

async function postToInstagram(videoUrl: string, caption: string, accessToken: string): Promise<string> {
  // TODO: Replace with real Instagram Graph API
  console.log(`[MOCK] Posting to Instagram: ${caption}`, videoUrl, accessToken);
  return `instagram_media_${Date.now()}`;
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId, platforms, scheduledAt } = await req.json();

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: session.user.id },
  });

  if (!project || !project.videoUrl) {
    return NextResponse.json({ error: "Project not ready" }, { status: 400 });
  }

  const socialAccounts = await prisma.socialAccount.findMany({
    where: { userId: session.user.id, platform: { in: platforms }, connected: true },
  });

  const posts = await Promise.all(
    socialAccounts.map(async (account) => {
      const post = await prisma.socialPost.create({
        data: {
          projectId,
          socialAccountId: account.id,
          platform: account.platform,
          status: scheduledAt ? "SCHEDULED" : "PENDING",
          scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        },
      });

      if (!scheduledAt) {
        try {
          let platformPostId: string;
          if (account.platform === "YOUTUBE") {
            platformPostId = await postToYouTube(
              project.videoUrl!,
              project.title,
              account.accessToken!
            );
          } else {
            platformPostId = await postToInstagram(
              project.videoUrl!,
              project.title,
              account.accessToken!
            );
          }
          await prisma.socialPost.update({
            where: { id: post.id },
            data: { status: "POSTED", postedAt: new Date(), platformPostId },
          });
        } catch (err: any) {
          await prisma.socialPost.update({
            where: { id: post.id },
            data: { status: "FAILED", errorMessage: err.message },
          });
        }
      }

      return post;
    })
  );

  return NextResponse.json({ posts });
}
