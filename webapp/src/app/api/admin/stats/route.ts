import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  void req;
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [totalUsers, totalProjects, proSubs, studioSubs] = await Promise.all([
    prisma.user.count(),
    prisma.project.count(),
    prisma.subscription.count({ where: { plan: "PRO", status: "ACTIVE" } }),
    prisma.subscription.count({ where: { plan: "STUDIO", status: "ACTIVE" } }),
  ]);

  return NextResponse.json({ totalUsers, totalProjects, proSubs, studioSubs });
}
