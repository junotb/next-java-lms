import LandingHeader from "@/components/landing/LandingHeader";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
