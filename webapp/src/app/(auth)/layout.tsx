export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#080a12] via-[#0f1120] to-[#080a12]">
      {children}
    </div>
  );
}
