import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
  typescript: true,
});

export const PLANS = {
  FREE: {
    name: "Free",
    price: 0,
    priceId: null,
    features: ["5 reels/month", "Basic voices", "720p export", "Watermark"],
  },
  PRO: {
    name: "Creator Pro",
    price: 999,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    features: [
      "Unlimited reels",
      "Viral story templates",
      "Premium voices + emotions",
      "Auto captions & edits",
      "No watermark",
    ],
  },
  STUDIO: {
    name: "Studio",
    price: 1999,
    priceId: process.env.STRIPE_STUDIO_PRICE_ID,
    features: [
      "Multi-channel publishing",
      "Team workspace",
      "Brand templates",
      "Priority support",
    ],
  },
};
