import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stripe, PLANS } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { plan } = await req.json();
  const planConfig = PLANS[plan as keyof typeof PLANS];
  if (!planConfig || !planConfig.priceId) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  let subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  let customerId = subscription?.stripeCustomerId;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: session.user.email!,
      name: session.user.name || undefined,
    });
    customerId = customer.id;

    await prisma.subscription.upsert({
      where: { userId: session.user.id },
      create: { userId: session.user.id, stripeCustomerId: customerId },
      update: { stripeCustomerId: customerId },
    });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: planConfig.priceId!, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?canceled=true`,
    metadata: { userId: session.user.id, plan },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
