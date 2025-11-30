import HomeHeader from "@/components/HomeHeader";
import HomeFooter from "@/components/HomeFooter";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <HomeHeader />
      <div className="flex-1">
        <main className="flex-1">{children}</main>
      </div>
      <HomeFooter />
    </div>
  );
}