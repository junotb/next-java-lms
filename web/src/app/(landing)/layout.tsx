import LandingHeader from "@/components/LandingHeader";
import LandingFooter from "@/components/LandingFooter";

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />
      <div className="flex-1">
        <main className="flex-1">{children}</main>
      </div>
      <LandingFooter />
    </div>
  );
}