"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { PLANS } from "@/lib/stripe";

export default function BillingPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    // session-based plan info could be fetched here
  }, [session]);

  async function handleUpgrade(plan: string) {
    setLoading(plan);
    const res = await fetch("/api/billing/create-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const { url } = await res.json();
    if (url) window.location.href = url;
    setLoading(null);
  }

  async function handleManage() {
    setLoading("manage");
    const res = await fetch("/api/billing/portal", { method: "POST" });
    const { url } = await res.json();
    if (url) window.location.href = url;
    setLoading(null);
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold font-jakarta mb-2">Billing</h1>
      <p className="text-slate-400 mb-8">Manage your subscription</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {Object.entries(PLANS).map(([key, plan]) => (
          <div
            key={key}
            className={`card relative ${key === "PRO" ? "border-violet-500" : ""}`}
          >
            {key === "PRO" && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                Most popular
              </div>
            )}
            <h3 className="font-bold text-lg font-jakarta">{plan.name}</h3>
            <p className="text-3xl font-bold mt-2 mb-1">
              {plan.price === 0 ? "Free" : `₹${plan.price}`}
              {plan.price > 0 && <span className="text-sm font-normal text-slate-400">/mo</span>}
            </p>
            <ul className="space-y-2 my-4">
              {plan.features.map((f) => (
                <li key={f} className="text-sm text-slate-300 flex items-center gap-2">
                  <span className="text-violet-400">✓</span> {f}
                </li>
              ))}
            </ul>
            {key !== "FREE" && (
              <button
                className={`w-full mt-2 ${key === "PRO" ? "btn-primary" : "btn-secondary"}`}
                onClick={() => handleUpgrade(key)}
                disabled={loading === key}
              >
                {loading === key ? "Redirecting…" : `Get ${plan.name}`}
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="font-semibold mb-1">Manage Subscription</h2>
        <p className="text-sm text-slate-400 mb-4">
          Update payment method, cancel, or view invoices
        </p>
        <button className="btn-secondary" onClick={handleManage} disabled={loading === "manage"}>
          {loading === "manage" ? "Loading…" : "Open Billing Portal"}
        </button>
      </div>
    </div>
  );
}
