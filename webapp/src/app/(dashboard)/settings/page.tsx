"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [socialAccounts, setSocialAccounts] = useState<any[]>([]);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [mockToken, setMockToken] = useState("");

  useEffect(() => {
    fetch("/api/social/connect").then((r) => r.json()).then(setSocialAccounts);
  }, []);

  async function connectPlatform(platform: string) {
    setConnecting(platform);
    await fetch("/api/social/connect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        platform,
        accessToken: mockToken || `mock_${platform.toLowerCase()}_token`,
        channelId: `mock_${platform.toLowerCase()}_id`,
        channelName: `${session?.user?.name}'s ${platform} Channel`,
      }),
    });
    const updated = await fetch("/api/social/connect").then((r) => r.json());
    setSocialAccounts(updated);
    setConnecting(null);
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold font-jakarta mb-2">Settings</h1>
      <p className="text-slate-400 mb-8">Manage your account and integrations</p>

      <div className="card mb-6">
        <h2 className="font-semibold mb-4">Profile</h2>
        <div className="space-y-3">
          <div>
            <label className="label">Name</label>
            <input className="input" value={session?.user?.name || ""} readOnly />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" value={session?.user?.email || ""} readOnly />
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <h2 className="font-semibold mb-1">Social Accounts</h2>
        <p className="text-sm text-slate-400 mb-4">
          Connect accounts for one-click auto-posting
        </p>

        <div className="mb-4">
          <label className="label">Access Token (for testing)</label>
          <input
            className="input"
            placeholder="Paste OAuth token or leave blank for mock"
            value={mockToken}
            onChange={(e) => setMockToken(e.target.value)}
          />
        </div>

        {["YOUTUBE", "INSTAGRAM"].map((platform) => {
          const acc = socialAccounts.find((a) => a.platform === platform);
          return (
            <div
              key={platform}
              className="flex items-center justify-between py-3 border-b border-[#1e2340] last:border-0"
            >
              <div>
                <p className="font-medium text-sm">{platform}</p>
                {acc?.channelName && (
                  <p className="text-xs text-slate-500">{acc.channelName}</p>
                )}
              </div>
              {acc?.connected ? (
                <span className="text-xs bg-green-500/20 text-green-400 px-2.5 py-1 rounded-full">
                  Connected
                </span>
              ) : (
                <button
                  className="btn-secondary text-xs py-1.5"
                  onClick={() => connectPlatform(platform)}
                  disabled={connecting === platform}
                >
                  {connecting === platform ? "Connecting…" : "Connect"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
